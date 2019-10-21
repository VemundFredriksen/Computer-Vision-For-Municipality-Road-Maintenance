#include "darknet.h" 

//Run Prediction

int predict(char *datacfg, char *cfgfile, int **net_in, char *filename, float thresh, float hier_thresh, char *outfile, int fullscreen, int *nnboxes)
{
    list *options = read_data_cfg(datacfg);
    char *name_list = option_find_str(options, "names", "obj.names");
    char **names = get_labels(name_list);
    
    //image **alphabet = load_alphabet();
    network *net = net_in;
    set_batch_network(net, 1);
    srand(2222222);
    double time;
    char buff[256];
    char *input = buff;
    float nms=.45;

    strncpy(input, filename, 256);
    image im = load_image_color(input,0,0);
    image sized = letterbox_image(im, net->w, net->h);
    layer l = net->layers[net->n-1];
    float *X = sized.data;
    time=what_time_is_it_now();
    network_predict(net, X);
    printf("%s: Predicted in %f seconds.\n", input, what_time_is_it_now()-time);
    int nboxes = 0;
    detection *dets = get_network_boxes(net, im.w, im.h, thresh, hier_thresh, 0, 1, &nboxes);
    if (nms) do_nms_sort(dets, nboxes, l.classes, nms);
/*    
if(outfile){
            save_image(im, outfile);
        }
        else{
            save_image(im, "predictions");
        }
*/
        free_image(im);
        free_image(sized);
        
        return dets;
}

//Frees the detections
void free_dets(detection *dets, int nboxes)
{
	free_detections(dets, nboxes);
}

//Train Network
float custom_train(char *datacfg, char *cfgfile, int **net_in, int *gpus, int ngpus, int clear, int epoch_size, int epoch)
{
    list *options = read_data_cfg(datacfg);
    char *train_images = option_find_str(options, "train", "data/train.list");
    char *backup_directory = option_find_str(options, "backup", "/backup/");

    srand(time(0));
    char *base = basecfg(cfgfile);
    float avg_loss = -1;
    network **nets = calloc(ngpus, sizeof(network));
    srand(time(0));
    int seed = rand();
    int i;
    for(i = 0; i < ngpus; ++i){
        srand(seed);
#ifdef GPU
        cuda_set_device(0);
#endif
        
        nets[i] = net_in;
        nets[i]->learning_rate *= ngpus;
    }
    srand(time(0));
    network *net = nets[0];
    
    int imgs = net->batch * net->subdivisions * ngpus;
    printf("Learning Rate: %g, Momentum: %g, Decay: %g\n", net->learning_rate, net->momentum, net->decay);
    data train, buffer;

    layer l = net->layers[net->n - 1];

    int classes = l.classes;
    float jitter = l.jitter;

    list *plist = get_paths(train_images);
    //int N = plist->size;
    char **paths = (char **)list_to_array(plist);

    load_args args = get_base_args(net);
    args.coords = l.coords;
    args.paths = paths;
    args.n = imgs;
    args.m = plist->size;
    args.classes = classes;
    args.jitter = jitter;
    args.num_boxes = l.max_boxes;
    args.d = &buffer;
    args.type = DETECTION_DATA;
    //args.type = INSTANCE_DATA;
    args.threads = 64;

    pthread_t load_thread = load_data(args);
    double time;
    int count = 0;
    //while(i*imgs < N*120){
    while(get_current_batch(net) < net->max_batches){
        if(l.random && count++%10 == 0){
            printf("Resizing\n");
            int dim = (rand() % 10 + 10) * 32;
            if (get_current_batch(net)+200 > net->max_batches) dim = 608;
            //int dim = (rand() % 4 + 16) * 32;
            args.w = dim;
            args.h = dim;

            pthread_join(load_thread, 0);
            train = buffer;
            free_data(train);
            load_thread = load_data(args);

            #pragma omp parallel for
            for(i = 0; i < ngpus; ++i){
                resize_network(nets[i], dim, dim);
            }
            net = nets[0];
        }
        time=what_time_is_it_now();
        pthread_join(load_thread, 0);
        train = buffer;
        load_thread = load_data(args);

        printf("Loaded: %lf seconds\n", what_time_is_it_now()-time);

        time=what_time_is_it_now();
        float loss = 0;
#ifdef GPU
        if(ngpus == 1){
            loss = train_network(net, train);
        } else {
            loss = train_networks(nets, ngpus, train, 4);
        }
#else
        loss = train_network(net, train);
#endif
        if (avg_loss < 0) avg_loss = loss;
        avg_loss = avg_loss*.9 + loss*.1;

        i = get_current_batch(net);
        printf("%ld: %f, %f avg, %f rate, %lf seconds, %d images\n", get_current_batch(net), loss, avg_loss, get_current_rate(net), what_time_is_it_now()-time, i*imgs);
        if(i%100==0){
#ifdef GPU
            if(ngpus != 1) sync_nets(nets, ngpus, 0);
#endif
            char buff[256];
            sprintf(buff, "%s/%s.backup", backup_directory, base);
            save_weights(net, buff);
        }
        if(i%10000==0 || (i < 1000 && i%100 == 0)){
#ifdef GPU
            if(ngpus != 1) sync_nets(nets, ngpus, 0);
#endif
            char buff[256];
            sprintf(buff, "%s/%s_%d.weights", backup_directory, base, i);
            save_weights(net, buff);
        }
        free_data(train);
	if(i*imgs >= epoch_size * epoch){
		return avg_loss;	
	}
    }
#ifdef GPU
    if(ngpus != 1) sync_nets(nets, ngpus, 0);
#endif
    char buff[256];
    sprintf(buff, "%s/%s_final.weights", backup_directory, base);
    save_weights(net, buff);
    
    return avg_loss;
}

int fetch_gpus()
{
    int gpu = 0;
    int *gpus = 0;
    gpu = gpu_index;
    printf("%d", gpu);
    gpus = &gpu;
    return gpus;
}

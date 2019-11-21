# Computer Vision Module

## Prerequisites
Though it may be possible to run the module on different operating systems, we have only made sure it runs on Ubuntu 18.04 so this is the environment we recommend using to host the computer vision tool. If one desires to host it on other operating system, docker may be an appropriate option.

*Note: The module has been run successfully on both x86-architecture and ARM-based architectures.*

Python2 and Python3 must be installed.
The system should have a NVidia GPU with at least 4Gb of VRAM available. It is possible to compile darknet to run on the CPU, but the time required to perform analysis will be increased in the magnitude of 100 to 300 times the time used when ran on GPU depending on the CPU and GPU. CUDA and cudnn must be installed on the system, information about this process can be found here https://docs.nvidia.com/cuda/.


The system also needs opencv installed. In Ubuntu, simply run *apt-get install python-opencv*.

On some systems we experienced problems with underlying libraries missing for opencv to work, it was solved by running *apt-get install libjpeg-dev zlib1g-dev*.


## Build
Most of the interface code runs on python and does not need to compile. The core YOLO code however is written in C and CUDA and needs to be compiled for the system it will run on. The make file is located in */cvmodule/core/darknet/*. The makefile must know the path to the cuda libraries. Either cuda must be added to the system path or you can specify the path to the cuda library in the makefile where it says *nvcc=nvcc*. The path to the cuda library is usually something like */usr/local/cuda/bin/nvcc*.

On linux, simply run 'make' in this directory.


## Deploy and Run
If the host system has the necessary prerequisites in place and the core code has been built there are few configurations that needs to be fixed before running. All configurations are found in /cvmodule/Server/config.txt. In this file you specify where your compiled libdarknet.so file is, what folder the FTP server should use as root, where your weights are and what fps the analysis should run at.

If the host is connected to the internet through a router the router needs to forward the ports 21, 22 and 60000 til 60005 to the host computer. These are the ports needed for the FTP to work.

If you want to use the pretrained weights they are available to download from here:
https://drive.google.com/drive/folders/1Y1oPwf7pAxci3eTjVfweZ_UjCzgYZil0?usp=sharing

To start the module simply run *sudo python3 server.py* in */cvmodule/Server/*. It needs admin privelgies to open TCP ports, therefore sudo. When started the ftp-server will stand by waiting for files to be analyzed.

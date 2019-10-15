
def run_cv_dummy(file_path):
	print("running cv dummy on video %s" % file_path)

	import random
	import math
	upper_bound = 1000000
	lower_bound = 100000
	num_primes = 1000
	primes_to_find = [random.randrange(lower_bound, upper_bound) for i in range(num_primes)]

	#nth prime upper bound
	size = upper_bound * math.log(upper_bound) + upper_bound*math.log(math.log(upper_bound))

	size = int(size)
	sieve = [True for i in range(size)]
	sieve[0] = False
	sieve[1] = False

	for i in range(2,size):
		if sieve[i]:
			for j in range(i+i, size, i):
				sieve[j] = False
	primes = [prime for prime in range(size) if sieve[prime]]

	for i in primes_to_find:
		print("Prime #%d is %d" % ((i+1), primes[i]))


# Correct
# def fib(n):
#    if n <= 1:
#        return n
#    else:
#        return(fib(n-1) + fib(n-2))

# Wrong
def fib(n):
   if n <= 2:
       return n
   else:
       return(fib(n-1) + fib(n-2))
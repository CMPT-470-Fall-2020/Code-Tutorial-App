include ("studentCode.jl")

# n = 0
if factorial(0) == 0
    println("n = 0 passed the factorialTest")
else 
    println("n = 0 failed the factorialTest")
end

# n = 1
if factorial(1) == 1
    println("n = 1 passed the factorialTest")
else 
    println("n = 1 failed the factorialTest")
end

# n = 2
if factorial(2) == 2
    println("n = 2 passed the factorialTest")
else 
    println("n = 2 failed the factorialTest")
end

# n = 10
if factorial(10) == 3628800
    println("n = 10 passed the factorialTest")
else 
    println("n = 10 failed the factorialTest")
end
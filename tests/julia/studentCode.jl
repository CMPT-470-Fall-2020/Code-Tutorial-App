
# Correct
function factorial(n)
    result = one(n)
    for i in 1:n
        result *= i
    end
    return result
end

# Wrong
#function factorial(n)
#    result = one(n)
#    for i in 1:n
#        result *= i + 1
#    end
#    return result
#end
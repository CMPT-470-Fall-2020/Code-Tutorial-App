#!/bin/bash
source ./studentCode.sh

runTest() {
    # n = 5
    square 5
    if (($? == 25))
    then
        echo "n = 2 passed for square()"
    else 
        echo "n = 2 failed for square()"
    fi

    # n = 1
    square 1
    if (($? == 1))
    then
        echo "n = 1 passed for square()"
    else 
        echo "n = 1 failed for square()"
    fi

     # n = 10
    square 10
    if (($? == 100))
    then
        echo "n = 10 passed for square()"
    else 
        echo "n = 10 failed for square()"
    fi
}

runTest
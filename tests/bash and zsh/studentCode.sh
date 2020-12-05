#!/bin/bash

# Correct
square() {
    local a=$1
    local square=$((a * a))
    return $square
}

# # Wrong
# square() {
#     local a=$1
#     local square=$((a + a))
#     return $square
# }
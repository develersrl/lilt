#! /bin/bash

print_usage()
{
    echo "Usage: "$BASH_SOURCE" in out"
    echo "in: input file"
    echo "out: output directory"
}

# if less than 2 arguments passed, or the first is a directory or the second is
# a file
if [[ $# -lt 2 ]] || [[ -d $1 ]] || [[ -f $2 ]]; then
    print_usage
    if [[ "$BASH_SOURCE" != "$0" ]]; then
        return;
    else
        exit
    fi
fi

curr_dir="$(dirname "$BASH_SOURCE")"
temp_file=$(mktemp)

"$curr_dir"/clean.sh "$1" > $temp_file
"$curr_dir"/populate.py $temp_file "$2"

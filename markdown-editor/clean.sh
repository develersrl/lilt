#! /bin/bash

print_usage()
{
    echo "Usage: "$BASH_SOURCE" in out"
    echo "in: input file"
    echo "out: output markdown file"
}

if [[ $# -lt 2 ]]; then
    print_usage
    if [[ "$BASH_SOURCE" != "$0" ]]; then
        return;
    else
        exit
    fi
fi

# convert to markdown
pandoc "$1" -t markdown -o "$2"

# remove <span>s
sed -i -e 's/<span.*\/span>//g' "$2"

# remove block-quotes
sed -i -e 's/>\s*//g' "$2"

# there may be some strange *\\* tokens
sed -i -e 's/\*\\\\\*//g' "$2"

# there are some corrupted headers in the resulting file
# instead of looking like:
# ```
# ### header
# Blah blah
# ```
# they look like
# ```
# **header\
# **Blah blah
# ```
# we fix that with perl, because sed is line-based
perl -0777 -pi -e 's/\*\*(.*)\\\n\*\*/### $1\n\n/g' "$2"

# remove everything after the WIKI (glossary) section
sed -ri -e '/faq.*domande.*screening.*mammografico/I,$d' "$2"

# remove everything before the SAPERNE DI PIÙ (content) section
sed -ri -e '1,/accesso libero/Id' "$2"
sed -i '1d' "$2"

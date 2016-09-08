#! /bin/bash

# convert to markdown
pandoc "$1" -t markdown |

# remove <span>s
sed -e 's/<span.*\/span>//g' |

# remove block-quotes
sed -e 's/>\s*//g' |

# there may be some strange *\\* tokens
sed -e 's/\*\\\\\*//g' |

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
perl -0777 -p -e 's/\*\*(.*)\\\n\*\*/### $1\n\n/g' |

# remove everything after the WIKI (glossary) section
sed -r -e '/faq.*domande.*screening.*mammografico/I,$d' |

# remove everything before the SAPERNE DI PIÙ (content) section
sed -r -e '1,/accesso libero/Id' |
sed '1d'

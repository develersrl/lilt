# -*- coding: utf-8 -*-


class LogWrapper(object):
    """Generic class wrapper.

    Use case: you need to add the support for a new markdown feature but you
    do not know which renderer method to override.
    In this case you can build mistune renderer this way:

        renderer = mistune.Markdown(renderer=Wrapper(RNRenderer()))
        renderer(<markdown-code-here>)

    Called methods will be printed on stdout.
    """
    def __init__(self, wrapped_class):
        self.wrapped_class = wrapped_class

    def __getattr__(self, attr):
        orig_attr = self.wrapped_class.__getattribute__(attr)
        if callable(orig_attr):
            def hooked(*args, **kwargs):
                self.log(attr, args, kwargs)
                result = orig_attr(*args, **kwargs)
                # prevent wrapped_class from becoming unwrapped
                if result == self.wrapped_class:
                    return self
                return result
            return hooked
        else:
            return orig_attr

    def log(self, methname, *args, **kwargs):
        print "{}\n\tArgs: {}\n\tKwArgs: {}\n".format(methname, args, kwargs)

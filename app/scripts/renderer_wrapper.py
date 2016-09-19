# -*- coding: utf-8 -*-


class RendererWrapper(object):

    def __init__(self, wrapped_class, log=False):
        self.wrapped_class = wrapped_class
        self.log_enabled = log
        self.collected_images = []


    def __getattr__(self, attr):
        orig_attr = self.wrapped_class.__getattribute__(attr)
        if callable(orig_attr):
            def hooked(*args, **kwargs):
                if attr == 'image':
                    self.collected_images.append(args)
                    return ''

                self.log(attr, args, kwargs)
                result = self.flush_images()
                result += orig_attr(*args, **kwargs)

                # prevent wrapped_class from becoming unwrapped
                if result == self.wrapped_class:
                    return self
                return result
            return hooked
        else:
            return orig_attr


    def log(self, methname, *args, **kwargs):
        if self.log_enabled:
            print "{}\n\tArgs: {}\n\tKwArgs: {}\n".format(
                methname,
                args,
                kwargs
                )


    def flush_images(self):
        result = ''
        if len(self.collected_images) > 0:
            self.log('image_stripe', self.collected_images)
            result = self.wrapped_class.image_stripe(self.collected_images)
            self.collected_images = []
        return result

import pickle

class Cache:
    def __init__(self, filename):
        self.filename = filename

    def save(self, obj):
        with open(self.filename, 'wb') as f:
            pickle.dump(obj, f)

    def load(self):
        try:
            with open(self.filename, 'rb') as f:
                return pickle.load(f)
        except FileNotFoundError:
            print("Cache file not found. Returning None.")
            return None
 
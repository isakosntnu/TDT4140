import random
from .models import Movie
from django.db.models import Q
from .serializers import SearchedMovieSerializer


def get_random_movies(count):
    all_movies = list(Movie.objects.all())
    
    if len(all_movies) < count:
        count = len(all_movies)
    
    random_movies = random.sample(all_movies, count)
    
    serialized_movies = []
    for movie in random_movies:
        actors = [actor.name for actor in movie.actors.all()]
        director = movie.director.name if movie.director else None
        genres = [genre.name for genre in movie.genres.all()]

        serialized_movie = {
            'id': movie.id,
            'title': movie.title,
            'image_url': movie.image_url,
            'runtime': movie.length,
            'actors': actors,
            'genres': genres,
            'director': director,
            'genres': genres,
        }
        serialized_movies.append(serialized_movie)
    
    return serialized_movies

def search_movies(query):
    ### ChatGPT
    searched_movies = Movie.objects.filter(
        Q(title__icontains=query) |
        Q(actors__name__icontains=query) |
        Q(director__name__icontains=query)
    ).distinct().order_by('title')
    ###
    
    serialized_movies = SearchedMovieSerializer(searched_movies, many=True).data

    return serialized_movies
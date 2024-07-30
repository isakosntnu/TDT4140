from django.contrib import admin
from .models import (
    Director, Actor, Genre, Movie,
    Review, FavoriteActor, FavoriteDirector, FavoriteGenre, FavoriteMovie
)

admin.site.register(Director)
admin.site.register(Actor)
admin.site.register(Genre)
admin.site.register(Movie)
admin.site.register(Review)
admin.site.register(FavoriteActor)
admin.site.register(FavoriteDirector)
admin.site.register(FavoriteGenre)
admin.site.register(FavoriteMovie)
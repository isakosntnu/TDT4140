# Almost the whole file has been written with help from Github Copilot (https://copilot.github.com/)

from django.db import models
from django.db.models import CheckConstraint, Q, UniqueConstraint


# Use Django's built-in User model for better security

from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class Director(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Actor(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class Genre(models.Model):
    name = models.CharField(max_length=255)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=255)
    director = models.ForeignKey(Director, on_delete=models.CASCADE, related_name='movies')
    actors = models.ManyToManyField(Actor, related_name='movies')
    genres = models.ManyToManyField(Genre, related_name='movies')
    length = models.IntegerField()
    release_year = models.IntegerField()
    image_url = models.URLField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.title

class FavoriteMovie(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_movies')
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='favorited_by')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class FavoriteDirector(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_directors')
    director = models.ForeignKey(Director, on_delete=models.CASCADE, related_name='favorited_by')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class FavoriteActor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_actors')
    actor = models.ForeignKey(Actor, on_delete=models.CASCADE, related_name='favorited_by')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
class FavoriteGenre(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_genres')
    genre = models.ForeignKey(Genre, on_delete=models.CASCADE, related_name='favorited_by')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Review(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.IntegerField(null=True, blank=True)
    comment = models.TextField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ### ChatGPT
        constraints = [
            CheckConstraint(check=Q(rating__gte=1) & Q(rating__lte=5) | Q(rating__isnull=True), name='rating_range'),
            UniqueConstraint(fields=['user', 'movie'], name='unique_review_per_user_per_movie')
        ]
        ###
    
    def __str__(self):
        return self.comment
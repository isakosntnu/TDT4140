from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.contenttypes.models import ContentType
from .models import (
    Director, Actor, Genre, Movie, FavoriteMovie, FavoriteActor, FavoriteDirector, FavoriteGenre, Review
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, data):
        user = User.objects.create_user(
            username=data['username'],
            password=data['password']
        )
        return user

class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Director
        fields = ['id', 'name', 'created_at', 'updated_at']

class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = ['id', 'name', 'created_at', 'updated_at']

class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name', 'created_at', 'updated_at']

class MovieSerializer(serializers.ModelSerializer):
    director = DirectorSerializer(read_only=True)
    actors = ActorSerializer(many=True, read_only=True)
    genres = GenreSerializer(many=True, read_only=True)

    class Meta:
        model = Movie
        fields = ['id', 'title', 'director', 'actors', 'genres', 'length', 'release_year', 'image_url', 'created_at', 'updated_at']

class SearchedMovieSerializer(serializers.ModelSerializer):
    director = DirectorSerializer(read_only=True)
    actors = ActorSerializer(many=True, read_only=True)
    genres = GenreSerializer(many=True, read_only=True)
    
    class Meta:
        model = Movie
        fields = ['id', 'title', 'director', 'actors', 'genres', 'length', 'release_year', 'image_url', 'created_at', 'updated_at']

class ReviewSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)
    movie_id = serializers.IntegerField(write_only=True)
    movie = MovieSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'movie', 'user', 'rating', 'comment', 'created_at', 'updated_at', 'user_id', 'movie_id']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id', None)
        movie_id = validated_data.pop('movie_id', None)
        user = User.objects.get(pk=user_id) if user_id else None
        movie = Movie.objects.get(pk=movie_id) if movie_id else None

        review = Review.objects.create(user=user, movie=movie, **validated_data)
        return review

class FavoriteMovieSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)
    movie_id = serializers.IntegerField(write_only=True)
    movie = MovieSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = FavoriteMovie
        fields = ['id', 'movie', 'user', 'created_at', 'updated_at', 'user_id', 'movie_id']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id', None)
        movie_id = validated_data.pop('movie_id', None)
        user = User.objects.get(pk=user_id) if user_id else None
        movie = Movie.objects.get(pk=movie_id) if movie_id else None

        favorite_movie = FavoriteMovie.objects.create(user=user, movie=movie)
        return favorite_movie
    
class FavoriteDirectorSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)
    director_id = serializers.IntegerField(write_only=True)
    director = DirectorSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = FavoriteDirector
        fields = ['id', 'director', 'user', 'created_at', 'updated_at', 'user_id', 'director_id']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id', None)
        director_id = validated_data.pop('director_id', None)
        user = User.objects.get(pk=user_id) if user_id else None
        director = Director.objects.get(pk=director_id) if director_id else None

        favorite_director = FavoriteDirector.objects.create(user=user, director=director)
        return favorite_director
    
class FavoriteActorSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)
    actor_id = serializers.IntegerField(write_only=True)
    actor = ActorSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = FavoriteActor
        fields = ['id', 'actor', 'user', 'created_at', 'updated_at', 'user_id', 'actor_id']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id', None)
        actor_id = validated_data.pop('actor_id', None)
        user = User.objects.get(pk=user_id) if user_id else None
        actor = Actor.objects.get(pk=actor_id) if actor_id else None

        favorite_actor = FavoriteActor.objects.create(user=user, actor=actor)
        return favorite_actor
    
class FavoriteGenreSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)
    genre_id = serializers.IntegerField(write_only=True)
    genre = GenreSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = FavoriteGenre
        fields = ['id', 'genre', 'user', 'created_at', 'updated_at', 'user_id', 'genre_id']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id', None)
        genre_id = validated_data.pop('genre_id', None)
        user = User.objects.get(pk=user_id) if user_id else None
        genre = Genre.objects.get(pk=genre_id) if genre_id else None

        favorite_genre = FavoriteGenre.objects.create(user=user, genre=genre)
        return favorite_genre
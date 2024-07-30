from rest_framework import viewsets, generics
from django.contrib.auth.models import User

from app.utils import get_random_movies, search_movies
from .models import (
    Director, Actor, Genre, Movie, Review, FavoriteGenre, FavoriteActor, FavoriteDirector, FavoriteMovie
)
from .serializers import (
    UserSerializer, DirectorSerializer, ActorSerializer, GenreSerializer, MovieSerializer, ReviewSerializer, FavoriteActorSerializer, FavoriteDirectorSerializer, FavoriteGenreSerializer, FavoriteMovieSerializer
)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class UserCreate(APIView):
    
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from django.contrib.auth import authenticate, login
from rest_framework.permissions import AllowAny

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response({
                "message": "Login successful",
                "user": UserSerializer(user).data  # Return user details
            }, status=status.HTTP_200_OK)
        else:
            return Response({"message": "Invalid username or password"}, status=status.HTTP_401_UNAUTHORIZED)

# class ReviewCreate(APIView):
#     def post(self, request, *args, **kwargs):
#         serializer = ReviewSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DirectorViewSet(viewsets.ModelViewSet):
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer
    
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ActorViewSet(viewsets.ModelViewSet):
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer

class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    
class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        # data:
        # user_id, movie_id, rating?, comment?
        
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)

class RandomMoviesView(APIView):
    def get(self, request, amount, *args, **kwargs):
        try:
            movies = get_random_movies(amount)
            return Response(movies, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "Error Message"})

from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated

class FavoriteMovieView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    ### ChatGPT
    def post(self, request, *args, **kwargs):
        user = request.user  # Get the currently logged-in user
        movie_id = request.data.get('movie_id')

        return Response({'message': 'Added to favorites successfully'}, status=status.HTTP_201_CREATED) 
    ###     
class FavoriteMovieViewSet(viewsets.ModelViewSet):
    queryset = FavoriteMovie.objects.all()
    serializer_class = FavoriteMovieSerializer
    
    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        # data:
        # user_id, movie_id
        
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

        ### ChatGPT
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        ###
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class FavoriteDirectorViewSet(viewsets.ModelViewSet):
    queryset = FavoriteDirector.objects.all()
    serializer_class = FavoriteDirectorSerializer
    
    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        # data:
        # user_id, director_id
        
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class FavoriteActorViewSet(viewsets.ModelViewSet):
    queryset = FavoriteActor.objects.all()
    serializer_class = FavoriteActorSerializer
    
    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        # data:
        # user_id, actor_id
        
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class FavoriteGenreViewSet(viewsets.ModelViewSet):
    queryset = FavoriteGenre.objects.all()
    serializer_class = FavoriteGenreSerializer
    
    def create(self, request, *args, **kwargs):
        print(request.data)
        serializer = self.get_serializer(data=request.data)
        # data:
        # user_id, genre_id
        
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)


        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        instance.delete()
        
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class SearchMoviesView(APIView):
    def get(self, request, *args, **kwargs):
        query = self.request.query_params.get('query', '')
        try:
            movies = search_movies(query)
            return Response(movies, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": "Error Message"})


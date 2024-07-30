from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import FavoriteActorViewSet, FavoriteMovieView

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'directors', views.DirectorViewSet)
router.register(r'actors', views.ActorViewSet)
router.register(r'genres', views.GenreViewSet)
router.register(r'movies', views.MovieViewSet)
router.register(r'reviews', views.ReviewViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'favorite-movies', views.FavoriteMovieViewSet)
router.register(r'favorite-directors', views.FavoriteDirectorViewSet)
router.register(r'favorite-actors', views.FavoriteActorViewSet)
router.register(r'favorite-genres', views.FavoriteGenreViewSet)


urlpatterns = [
    path('favorites/', FavoriteMovieView.as_view(), name='favorite_movie'),
    path('', include(router.urls)),
    path('register/', views.UserCreate.as_view(), name='register'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('random-movies/<int:amount>/', views.RandomMoviesView.as_view(), name='random-movies'),
    path('search-movies/', views.SearchMoviesView.as_view()),
]

# Med hjelp ChatGPT

import pandas as pd
from django.core.management.base import BaseCommand
from django.db import transaction
from app.models import Movie, Director, Actor, Genre

class Command(BaseCommand):
    help = 'Import movies from a CSV file into the database using pandas'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='The CSV file to import')

    @transaction.atomic
    def handle(self, *args, **options):
        file_path = options['csv_file']

        df = pd.read_csv(file_path)

        for _, row in df.iterrows():
            director_name = row['Director'] if not pd.isna(row['Director']) else 'Unknown'
            director, _ = Director.objects.get_or_create(name=director_name)

            try:
                length = int(row['Runtime']) if not pd.isna(row['Runtime']) else 0
            except ValueError:
                length = 0

            movie, created = Movie.objects.get_or_create(
                title=row['Title'],
                defaults={
                    'director': director,
                    'release_year': int(row['Year']) if not pd.isna(row['Year']) else None,
                    'length': length,
                    'image_url': row['Movie Poster'] if not pd.isna(row['Movie Poster']) else '',
                }
            )

            if not pd.isna(row['Cast']):
                actor_names = [name.strip() for name in row['Cast'].split("|")]
                for actor_name in actor_names:
                    actor, _ = Actor.objects.get_or_create(name=actor_name)
                    movie.actors.add(actor)

            if not pd.isna(row['Genres']):
                genre_names = [name.strip() for name in row['Genres'].split("|")]
                for genre_name in genre_names:
                    genre, _ = Genre.objects.get_or_create(name=genre_name)
                    movie.genres.add(genre)

            action = "Added" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f'{action} movie: "{row["Title"]}"'))

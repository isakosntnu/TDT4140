# Created with the help of ChatGPT in certain places.
# Mostly for caching and structure for api calls.

import csv
import requests
import os
import json

cache_file = 'poster_cache.json'

def load_cache():
    try:
        if os.path.exists(cache_file):  # Check if the file exists before trying to open it
            with open(cache_file, 'r', encoding='utf-8') as file:
                return json.load(file)
        else:
            return {}  # Return an empty dictionary if the file does not exist
    except json.JSONDecodeError:
        return {}  # Handle a case where the cache file is empty or corrupted

def save_cache(cache):
    with open(cache_file, 'w', encoding='utf-8') as file:
        json.dump(cache, file, indent=4)

def fetch_movie_poster(imdb_id, cache):
    # Check the cache first
    if imdb_id in cache:
        print(f"Using cached poster URL for IMDB ID {imdb_id}")
        return cache[imdb_id]
    
    # Proceed with the API call if not found in cache
    url = f"https://moviesdatabase.p.rapidapi.com/titles/{imdb_id}"
    headers = {
        "X-RapidAPI-Key": "7b20fc8c3dmsh75554e0f359af80p16bb6fjsn85e4cfd1bb6b", # This is really stupid, but its a private repo who cares (-simen)
        "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Check for HTTPError
        data = response.json()
        if data and 'results' in data and data['results'] is not None and 'primaryImage' in data['results'] and 'url' in data['results']['primaryImage']:
            poster_url = data['results']['primaryImage']['url']
            cache[imdb_id] = poster_url  # Update cache
            save_cache(cache)  # Save cache immediately after update
            print(f"Fetched and cached poster URL for IMDB ID {imdb_id}: {poster_url}")
            return poster_url
        else:
            print(f"No poster URL found for IMDB ID {imdb_id}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Error fetching poster for IMDB ID {imdb_id}: {e}")
        return None

def update_csv_with_posters(csv_file_path, cache):
    updated_rows = []
    with open(csv_file_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            imdb_id = row['IMDB ID']
            new_poster_url = fetch_movie_poster(imdb_id, cache)
            if new_poster_url:
                row['Movie Poster'] = new_poster_url
            updated_rows.append(row)
    
    if updated_rows:
        with open(csv_file_path, mode='w', encoding='utf-8', newline='') as file:
            fieldnames = updated_rows[0].keys()
            writer = csv.DictWriter(file, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(updated_rows)  # Use writerows for efficiency

# Load existing cache
cache = load_cache()

csv_file_path = 'data.csv'

# Update CSV with new movie posters and utilize the cache
update_csv_with_posters(csv_file_path, cache)

# Save the updated cache to a file
save_cache(cache)


import pandas as pd
import json

def update_csv_with_cached_posters(csv_file_path, cache_file_path):
    # Load the cache
    try:
        with open(cache_file_path, 'r', encoding='utf-8') as file:
            cache = json.load(file)
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"Error loading cache: {e}")
        return

    # Load the CSV into a pandas DataFrame
    try:
        df = pd.read_csv(csv_file_path)
    except FileNotFoundError as e:
        print(f"Error loading CSV file: {e}")
        return

    # Update 'Movie Poster' column with cached URLs where available
    df['Movie Poster'] = df['IMDB ID'].apply(lambda x: cache.get(x, df['Movie Poster'][df['IMDB ID'] == x]))

    # Save the updated DataFrame back to the CSV
    df.to_csv("data_with_updated_posters.csv", index=False)
    print("CSV file has been updated with cached poster URLs.")

# Specify the paths to your CSV file and cache file
csv_file_path = 'data.csv'
cache_file_path = 'poster_cache.json'

# Update the CSV with cached poster URLs
update_csv_with_cached_posters(csv_file_path, cache_file_path)


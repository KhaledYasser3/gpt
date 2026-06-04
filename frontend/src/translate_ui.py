import re

file_path = 'e:/gpt/gpt/frontend/src/components/User/Chat.jsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    "What's on the agenda today?": "Où commence-t-on ?",
    "Ask anything": "Demander n'importe quoi",
    "Write anything": "Écrire n'importe quoi",
    "Describe or edit an image": "Décrire ou modifier une image",
    "Search the web": "Rechercher sur le web",
    "> Write\\n": "> Écrire\\n",
    "> Search\\n": "> Rechercher\\n",
    "Create an image": "Créer une image",
    "Write or edit": "Écrire ou modifier",
    "Look something up": "Rechercher quelque chose",
    "Explore ideas": "Explorer des idées",
    "What's new": "Nouveautés",
    "Upload a photo": "Importer une photo",
    "Improve Your Desk Setup": "Améliorer votre espace de travail",
    "Wanderlust": "Envie de voyager",
    "Scribble": "Gribouillage",
    "Make a message persuasive": "Rendre un message persuasif",
    "Improve clarity": "Améliorer la clarté",
    "Improve flow": "Améliorer la fluidité",
    "Shorten without losing meaning": "Raccourcir sans perdre le sens",
    "Choose image aspect ratio": "Choisir le format de l'image",
    "Square 1:1": "Carré 1:1",
    "Portrait 3:4": "Portrait 3:4",
    "Story 9:16": "Story 9:16",
    "Landscape 4:3": "Paysage 4:3",
    "Widescreen 16:9": "Écran large 16:9"
}

for eng, fre in replacements.items():
    content = content.replace(eng, fre)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Translation successful")

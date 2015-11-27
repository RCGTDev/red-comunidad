import csv
import json

csv_red = open('red-comunidad.csv', 'r')
# Skip first line
csv_red.seek(0)
next(csv_red)

json_red = open('red-comunidad.json', 'w')

json_data = {"name": "ministerios", "children": []}
ministerios = {}

dictReader = csv.DictReader(csv_red,
                            fieldnames=[
                                'ministerio', 'area', 'proyecto', 'enlace', 'tipo_ayuda', 'evento', 'bajada'],
                            delimiter=',',
                            quotechar='"')

for row in dictReader:
    ministerio = row['ministerio']
    titulo = row['proyecto']
    area = row['area']
    link = row['enlace']
    tipo_ayuda = row['tipo_ayuda']
    evento = row['evento']
    bajada = row['bajada']

    if ministerio not in ministerios:
        ministerios[ministerio] = []
    proyecto = {'name': titulo, 'area': area, 'link': link,
                'tipo_ayuda': tipo_ayuda, 'evento': evento, 'bajada': bajada}
    ministerios[ministerio].append(proyecto)

for ministerio in ministerios:
    json_data["children"].append(
        {"name": ministerio, "children": ministerios[ministerio]})

json.dump(json_data, json_red)

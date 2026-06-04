from flask import Flask, jsonify, request
from flask_cors import CORS
import networkx as nx
import random
import math
import json
import os

app = Flask(__name__)
CORS(app)

AREAS = {
    "bangalore": {
        "name": "Bangalore",
        "center": [12.9716, 77.5946],
        "localities": {
            "koramangala": {
                "name": "Koramangala",
                "center": [12.9352, 77.6245],
                "nodes": [
                    {"id": "K1", "lat": 12.9340, "lng": 77.6230, "name": "Koramangala 1st Block Junction"},
                    {"id": "K2", "lat": 12.9355, "lng": 77.6250, "name": "Koramangala 2nd Block Junction"},
                    {"id": "K3", "lat": 12.9370, "lng": 77.6220, "name": "Koramangala 3rd Block Junction"},
                    {"id": "K4", "lat": 12.9330, "lng": 77.6265, "name": "Koramangala 4th Block Junction"},
                    {"id": "K5", "lat": 12.9365, "lng": 77.6270, "name": "Koramangala 5th Block Junction"},
                    {"id": "K6", "lat": 12.9380, "lng": 77.6245, "name": "Koramangala 6th Block Junction"},
                    {"id": "K7", "lat": 12.9345, "lng": 77.6210, "name": "Koramangala 7th Block Junction"},
                    {"id": "K8", "lat": 12.9360, "lng": 77.6290, "name": "Jyoti Nivas Junction"},
                    {"id": "K9", "lat": 12.9325, "lng": 77.6240, "name": "Forum Mall Junction"},
                    {"id": "K10", "lat": 12.9375, "lng": 77.6260, "name": "AC Junction"},
                ],
                "edges": [
                    ("K1", "K2", 350), ("K2", "K5", 400), ("K5", "K8", 300),
                    ("K1", "K3", 450), ("K3", "K6", 350), ("K6", "K2", 280),
                    ("K1", "K7", 300), ("K7", "K9", 250), ("K9", "K4", 380),
                    ("K4", "K5", 420), ("K5", "K10", 310), ("K10", "K6", 290),
                    ("K3", "K10", 400), ("K8", "K10", 350), ("K4", "K9", 270),
                    ("K7", "K3", 380),
                ]
            },
            "indiranagar": {
                "name": "Indiranagar",
                "center": [12.9784, 77.6408],
                "nodes": [
                    {"id": "I1", "lat": 12.9770, "lng": 77.6390, "name": "100 Feet Road Junction"},
                    {"id": "I2", "lat": 12.9800, "lng": 77.6420, "name": "HAL 2nd Stage Junction"},
                    {"id": "I3", "lat": 12.9760, "lng": 77.6430, "name": "Indiranagar 1st Stage Junction"},
                    {"id": "I4", "lat": 12.9790, "lng": 77.6380, "name": "Indiranagar 2nd Stage Junction"},
                    {"id": "I5", "lat": 12.9750, "lng": 77.6400, "name": "Thippasandra Junction"},
                    {"id": "I6", "lat": 12.9810, "lng": 77.6400, "name": "CV Raman Nagar Junction"},
                    {"id": "I7", "lat": 12.9775, "lng": 77.6450, "name": "Murugeshpalya Junction"},
                    {"id": "I8", "lat": 12.9795, "lng": 77.6370, "name": "Old Madras Road Junction"},
                ],
                "edges": [
                    ("I1", "I2", 400), ("I2", "I6", 350), ("I6", "I4", 380),
                    ("I1", "I5", 320), ("I5", "I3", 300), ("I3", "I7", 450),
                    ("I4", "I1", 280), ("I7", "I2", 400), ("I8", "I4", 350),
                    ("I8", "I1", 300), ("I5", "I8", 420), ("I3", "I4", 360),
                    ("I6", "I7", 380),
                ]
            },
            "whitefield": {
                "name": "Whitefield",
                "center": [12.9698, 77.7500],
                "nodes": [
                    {"id": "W1", "lat": 12.9680, "lng": 77.7480, "name": "Whitefield Main Road Junction"},
                    {"id": "W2", "lat": 12.9710, "lng": 77.7510, "name": "ITPL Main Road Junction"},
                    {"id": "W3", "lat": 12.9670, "lng": 77.7520, "name": "Varthur Road Junction"},
                    {"id": "W4", "lat": 12.9700, "lng": 77.7460, "name": "Hope Farm Junction"},
                    {"id": "W5", "lat": 12.9720, "lng": 77.7480, "name": "Pattandur Agrahara Junction"},
                    {"id": "W6", "lat": 12.9690, "lng": 77.7540, "name": "Garudachar Palya Junction"},
                ],
                "edges": [
                    ("W1", "W2", 500), ("W2", "W5", 400), ("W5", "W4", 350),
                    ("W4", "W1", 380), ("W1", "W3", 450), ("W3", "W6", 420),
                    ("W6", "W2", 380), ("W5", "W3", 300), ("W4", "W5", 280),
                ]
            }
        }
    },
    "mysore": {
        "name": "Mysore",
        "center": [12.2958, 76.6394],
        "localities": {
            "gokulam": {
                "name": "Gokulam",
                "center": [12.3130, 76.6420],
                "nodes": [
                    {"id": "G1", "lat": 12.3120, "lng": 76.6400, "name": "Gokulam Main Road Junction"},
                    {"id": "G2", "lat": 12.3145, "lng": 76.6430, "name": "Vani Vilas Mohalla Junction"},
                    {"id": "G3", "lat": 12.3110, "lng": 76.6440, "name": "Srirampura Junction"},
                    {"id": "G4", "lat": 12.3135, "lng": 76.6390, "name": "Mahadevapura Junction"},
                    {"id": "G5", "lat": 12.3155, "lng": 76.6410, "name": "Nazrabad Junction"},
                    {"id": "G6", "lat": 12.3125, "lng": 76.6460, "name": "Tilak Nagar Junction"},
                    {"id": "G7", "lat": 12.3105, "lng": 76.6415, "name": "Siddarthanagar Junction"},
                    {"id": "G8", "lat": 12.3140, "lng": 76.6445, "name": "Bank Road Junction"},
                ],
                "edges": [
                    ("G1", "G2", 350), ("G2", "G5", 300), ("G5", "G6", 280),
                    ("G6", "G3", 320), ("G3", "G1", 380), ("G1", "G4", 260),
                    ("G4", "G5", 350), ("G2", "G3", 400), ("G4", "G2", 300),
                    ("G7", "G1", 220), ("G7", "G3", 280), ("G8", "G2", 190),
                    ("G8", "G6", 310), ("G5", "G8", 240),
                ]
            },
            "jayalakshmipuram": {
                "name": "Jayalakshmipuram",
                "center": [12.3190, 76.6380],
                "nodes": [
                    {"id": "J1", "lat": 12.3180, "lng": 76.6360, "name": "Jayalakshmipuram Main Junction"},
                    {"id": "J2", "lat": 12.3205, "lng": 76.6390, "name": "KRS Road Junction"},
                    {"id": "J3", "lat": 12.3170, "lng": 76.6400, "name": "Museums Road Junction"},
                    {"id": "J4", "lat": 12.3200, "lng": 76.6350, "name": "University Road Junction"},
                    {"id": "J5", "lat": 12.3185, "lng": 76.6420, "name": "Saraswathipuram 2nd Stage"},
                    {"id": "J6", "lat": 12.3160, "lng": 76.6370, "name": "Manasagangotri Junction"},
                    {"id": "J7", "lat": 12.3210, "lng": 76.6370, "name": "Sathgalli Junction"},
                ],
                "edges": [
                    ("J1", "J2", 380), ("J2", "J5", 350), ("J5", "J3", 320),
                    ("J3", "J1", 300), ("J1", "J4", 280), ("J4", "J6", 350),
                    ("J6", "J1", 310), ("J2", "J7", 290), ("J7", "J4", 340),
                    ("J3", "J6", 270), ("J5", "J2", 350),
                ]
            },
            "saraswathipuram": {
                "name": "Saraswathipuram",
                "center": [12.3220, 76.6440],
                "nodes": [
                    {"id": "S1", "lat": 12.3210, "lng": 76.6420, "name": "Saraswathipuram Main Junction"},
                    {"id": "S2", "lat": 12.3235, "lng": 76.6450, "name": "Bogadi Road Junction"},
                    {"id": "S3", "lat": 12.3200, "lng": 76.6460, "name": "Nrupathunga Road Junction"},
                    {"id": "S4", "lat": 12.3230, "lng": 76.6410, "name": "Vani Vilas Mohalla Ext"},
                    {"id": "S5", "lat": 12.3215, "lng": 76.6480, "name": "Kamakshipalya Junction"},
                    {"id": "S6", "lat": 12.3195, "lng": 76.6430, "name": "Sharadadevi Nagar Junction"},
                ],
                "edges": [
                    ("S1", "S2", 360), ("S2", "S5", 380), ("S5", "S3", 320),
                    ("S3", "S1", 300), ("S1", "S4", 280), ("S4", "S6", 350),
                    ("S6", "S1", 310), ("S2", "S4", 290), ("S3", "S6", 340),
                ]
            },
            "vijayanagar": {
                "name": "Vijayanagar",
                "center": [12.3050, 76.6220],
                "nodes": [
                    {"id": "V1", "lat": 12.3040, "lng": 76.6200, "name": "Vijayanagar Main Junction"},
                    {"id": "V2", "lat": 12.3065, "lng": 76.6230, "name": "Chamarajapuram Junction"},
                    {"id": "V3", "lat": 12.3030, "lng": 76.6240, "name": "Hebbal 1st Stage Junction"},
                    {"id": "V4", "lat": 12.3060, "lng": 76.6190, "name": "KRS Road Extension"},
                    {"id": "V5", "lat": 12.3050, "lng": 76.6260, "name": "Niveditha Nagar Junction"},
                    {"id": "V6", "lat": 12.3020, "lng": 76.6210, "name": "Chowdiah Memorial Junction"},
                    {"id": "V7", "lat": 12.3070, "lng": 76.6210, "name": "Metry Layout Junction"},
                    {"id": "V8", "lat": 12.3035, "lng": 76.6270, "name": "Pratibha Nagar Junction"},
                ],
                "edges": [
                    ("V1", "V2", 340), ("V2", "V5", 380), ("V5", "V3", 320),
                    ("V3", "V1", 300), ("V1", "V4", 280), ("V4", "V7", 350),
                    ("V7", "V1", 310), ("V2", "V4", 290), ("V3", "V6", 340),
                    ("V6", "V1", 260), ("V5", "V8", 300), ("V8", "V3", 280),
                ]
            },
            "kuvempu-nagar": {
                "name": "Kuvempu Nagar",
                "center": [12.3100, 76.6500],
                "nodes": [
                    {"id": "KN1", "lat": 12.3090, "lng": 76.6480, "name": "Kuvempu Nagar Main Junction"},
                    {"id": "KN2", "lat": 12.3115, "lng": 76.6510, "name": "Sathgalli Main Road Junction"},
                    {"id": "KN3", "lat": 12.3080, "lng": 76.6520, "name": "Yadavagiri Junction"},
                    {"id": "KN4", "lat": 12.3110, "lng": 76.6470, "name": "Narasimharaja Mohalla Ext"},
                    {"id": "KN5", "lat": 12.3100, "lng": 76.6540, "name": "Chamundi Hill Road Junction"},
                    {"id": "KN6", "lat": 12.3070, "lng": 76.6490, "name": "Lakshmipuram Junction"},
                ],
                "edges": [
                    ("KN1", "KN2", 380), ("KN2", "KN5", 400), ("KN5", "KN3", 350),
                    ("KN3", "KN1", 320), ("KN1", "KN4", 280), ("KN4", "KN6", 350),
                    ("KN6", "KN1", 310), ("KN2", "KN4", 300), ("KN3", "KN6", 340),
                    ("KN4", "KN5", 360),
                ]
            },
            "hebbal": {
                "name": "Hebbal",
                "center": [12.3200, 76.6300],
                "nodes": [
                    {"id": "H1", "lat": 12.3190, "lng": 76.6280, "name": "Hebbal Main Junction"},
                    {"id": "H2", "lat": 12.3215, "lng": 76.6310, "name": "Hebbal Police Station Junction"},
                    {"id": "H3", "lat": 12.3180, "lng": 76.6320, "name": "Hebbal 2nd Stage Junction"},
                    {"id": "H4", "lat": 12.3210, "lng": 76.6270, "name": "BEML Gate Junction"},
                    {"id": "H5", "lat": 12.3195, "lng": 76.6340, "name": "Bogadi Lake Junction"},
                    {"id": "H6", "lat": 12.3170, "lng": 76.6290, "name": "Vidyagiri Junction"},
                ],
                "edges": [
                    ("H1", "H2", 350), ("H2", "H5", 380), ("H5", "H3", 320),
                    ("H3", "H1", 300), ("H1", "H4", 280), ("H4", "H6", 350),
                    ("H6", "H1", 310), ("H2", "H4", 290), ("H3", "H6", 340),
                ]
            }
        }
    },
    "hubli": {
        "name": "Hubli",
        "center": [15.3647, 75.1240],
        "localities": {
            "vidyanagar": {
                "name": "Vidyanagar",
                "center": [15.3800, 75.1300],
                "nodes": [
                    {"id": "HU1", "lat": 15.3790, "lng": 75.1280, "name": "Vidyanagar Main Junction"},
                    {"id": "HU2", "lat": 15.3815, "lng": 75.1310, "name": "Hosur Colony Junction"},
                    {"id": "HU3", "lat": 15.3780, "lng": 75.1320, "name": "Keshwapur Junction"},
                    {"id": "HU4", "lat": 15.3810, "lng": 75.1270, "name": "Gokul Road Junction"},
                    {"id": "HU5", "lat": 15.3800, "lng": 75.1340, "name": "Shivabasava Nagar Junction"},
                    {"id": "HU6", "lat": 15.3770, "lng": 75.1290, "name": "Neelnagar Junction"},
                ],
                "edges": [
                    ("HU1", "HU2", 340), ("HU2", "HU5", 380), ("HU5", "HU3", 320),
                    ("HU3", "HU1", 360), ("HU1", "HU4", 300), ("HU4", "HU6", 280),
                    ("HU6", "HU1", 310), ("HU2", "HU3", 400), ("HU4", "HU2", 350),
                ]
            },
            "deshpande-nagar": {
                "name": "Deshpande Nagar",
                "center": [15.3700, 75.1200],
                "nodes": [
                    {"id": "D1", "lat": 15.3690, "lng": 75.1180, "name": "Deshpande Nagar Main Junction"},
                    {"id": "D2", "lat": 15.3715, "lng": 75.1210, "name": "Station Road Junction"},
                    {"id": "D3", "lat": 15.3680, "lng": 75.1220, "name": "BVB College Junction"},
                    {"id": "D4", "lat": 15.3710, "lng": 75.1170, "name": "Tilakwadi Junction"},
                ],
                "edges": [
                    ("D1", "D2", 350), ("D2", "D3", 300), ("D3", "D1", 280),
                    ("D1", "D4", 320), ("D4", "D2", 380), ("D3", "D4", 350),
                ]
            }
        }
    },
    "belagavi": {
        "name": "Belagavi",
        "center": [15.8497, 74.4977],
        "localities": {
            "sadashiv-nagar": {
                "name": "Sadashiv Nagar",
                "center": [15.8600, 74.5100],
                "nodes": [
                    {"id": "B1", "lat": 15.8590, "lng": 74.5080, "name": "Sadashiv Nagar Main Junction"},
                    {"id": "B2", "lat": 15.8615, "lng": 74.5110, "name": "KHB Colony Junction"},
                    {"id": "B3", "lat": 15.8580, "lng": 74.5120, "name": "Hegde Nagar Junction"},
                    {"id": "B4", "lat": 15.8610, "lng": 74.5070, "name": "Azam Nagar Junction"},
                    {"id": "B5", "lat": 15.8600, "lng": 74.5140, "name": "Rajesh Nagar Colony Junction"},
                    {"id": "B6", "lat": 15.8570, "lng": 74.5090, "name": "Kapileshwar Nagar Junction"},
                ],
                "edges": [
                    ("B1", "B2", 380), ("B2", "B5", 350), ("B5", "B3", 320),
                    ("B3", "B1", 300), ("B1", "B4", 280), ("B4", "B6", 350),
                    ("B6", "B1", 310), ("B2", "B3", 400), ("B4", "B2", 360),
                    ("B5", "B6", 330),
                ]
            },
            "tilakwadi": {
                "name": "Tilakwadi",
                "center": [15.8500, 74.5000],
                "nodes": [
                    {"id": "T1", "lat": 15.8490, "lng": 74.4980, "name": "Tilakwadi Main Junction"},
                    {"id": "T2", "lat": 15.8515, "lng": 74.5010, "name": "Sambhaji Nagar Junction"},
                    {"id": "T3", "lat": 15.8480, "lng": 74.5020, "name": "Nehru Nagar Junction"},
                    {"id": "T4", "lat": 15.8510, "lng": 74.4970, "name": "Congress Road Junction"},
                ],
                "edges": [
                    ("T1", "T2", 350), ("T2", "T3", 380), ("T3", "T4", 320),
                    ("T4", "T1", 300), ("T1", "T3", 340), ("T2", "T4", 360),
                ]
            }
        }
    }
}

def build_graph(area_data):
    G = nx.Graph()
    for node in area_data["nodes"]:
        G.add_node(node["id"], lat=node["lat"], lng=node["lng"], name=node["name"])
    for edge in area_data["edges"]:
        n1, n2, dist = edge
        G.add_edge(n1, n2, weight=dist)
    return G

def check_euler(G):
    if not nx.is_connected(G):
        return {"has_euler_path": False, "has_euler_circuit": False, "message": "Graph is not connected"}
    
    odd_degree_nodes = [v for v, d in G.degree() if d % 2 != 0]
    
    if len(odd_degree_nodes) == 0:
        return {
            "has_euler_path": True,
            "has_euler_circuit": True,
            "message": "Euler Circuit exists (all vertices have even degree)",
            "odd_degree_count": 0,
            "odd_degree_nodes": []
        }
    elif len(odd_degree_nodes) == 2:
        return {
            "has_euler_path": True,
            "has_euler_circuit": False,
            "message": "Euler Path exists (exactly 2 vertices with odd degree)",
            "odd_degree_count": 2,
            "odd_degree_nodes": odd_degree_nodes
        }
    else:
        return {
            "has_euler_path": False,
            "has_euler_circuit": False,
            "message": f"No Euler Path/Circuit ({len(odd_degree_nodes)} vertices with odd degree)",
            "odd_degree_count": len(odd_degree_nodes),
            "odd_degree_nodes": odd_degree_nodes
        }

def find_euler_route(G):
    euler_info = check_euler(G)
    
    if euler_info["has_euler_circuit"]:
        route = list(nx.eulerian_circuit(G))
        total_distance = sum(G[u][v]["weight"] for u, v in route)
        return {
            "route": route,
            "distance": total_distance,
            "edges_covered": len(route),
            "repeated_edges": 0,
            "type": "circuit",
            "info": euler_info
        }
    elif euler_info["has_euler_path"]:
        odd_nodes = euler_info["odd_degree_nodes"]
        route = list(nx.eulerian_path(G, odd_nodes[0], odd_nodes[1]))
        total_distance = sum(G[u][v]["weight"] for u, v in route)
        return {
            "route": route,
            "distance": total_distance,
            "edges_covered": len(route),
            "repeated_edges": 0,
            "type": "path",
            "info": euler_info
        }
    else:
        route_edges = []
        visited_edges = set()
        
        remaining = nx.MultiGraph(G)
        while remaining.number_of_edges() > 0:
            odd_nodes = [v for v, d in remaining.degree() if d % 2 != 0]
            if odd_nodes:
                start = odd_nodes[0]
            else:
                start = list(remaining.nodes())[0]
            
            sub_tour = []
            current = start
            while remaining.degree(current) > 0:
                neighbor = list(remaining.neighbors(current))[0]
                sub_tour.append((current, neighbor))
                remaining.remove_edge(current, neighbor)
                current = neighbor
            
            for edge in sub_tour:
                if edge in visited_edges:
                    route_edges.append(edge)
                else:
                    route_edges.append(edge)
                    visited_edges.add(edge)
        
        total_distance = sum(G[u][v]["weight"] for u, v in route_edges)
        repeated = len(route_edges) - len(visited_edges)
        
        return {
            "route": route_edges,
            "distance": total_distance,
            "edges_covered": len(route_edges),
            "repeated_edges": repeated,
            "type": "heuristic",
            "info": euler_info
        }

def generate_bins(area_data, seed=None):
    if seed is not None:
        random.seed(seed)
    
    bins = []
    for node in area_data["nodes"]:
        fill_level = random.randint(10, 100)
        if fill_level >= 90:
            status = "Critical"
        elif fill_level >= 70:
            status = "Full"
        elif fill_level >= 40:
            status = "Medium"
        else:
            status = "Empty"
        
        bins.append({
            "id": f"BIN-{node['id']}",
            "node_id": node["id"],
            "name": node["name"],
            "lat": node["lat"],
            "lng": node["lng"],
            "fill_level": fill_level,
            "status": status
        })
    
    if seed is not None:
        random.seed()
    
    return bins

@app.route("/api/areas", methods=["GET"])
def get_areas():
    result = {}
    for city_id, city in AREAS.items():
        result[city_id] = {
            "name": city["name"],
            "center": city["center"],
            "localities": {}
        }
        for loc_id, loc in city["localities"].items():
            result[city_id]["localities"][loc_id] = {
                "name": loc["name"],
                "center": loc["center"]
            }
    return jsonify(result)

@app.route("/api/graph/<city>/<locality>", methods=["GET"])
def get_graph(city, locality):
    if city not in AREAS:
        return jsonify({"error": "City not found"}), 404
    if locality not in AREAS[city]["localities"]:
        return jsonify({"error": "Locality not found"}), 404
    
    area_data = AREAS[city]["localities"][locality]
    G = build_graph(area_data)
    euler_info = check_euler(G)
    
    locality_seed = sum(ord(c) for c in locality)
    bins = generate_bins(area_data, seed=locality_seed)
    
    nodes_with_info = []
    for node in area_data["nodes"]:
        degree = G.degree(node["id"])
        nodes_with_info.append({
            **node,
            "degree": degree,
            "is_odd": degree % 2 != 0
        })
    
    edges_with_info = []
    for edge in area_data["edges"]:
        n1, n2, dist = edge
        edges_with_info.append({
            "source": n1,
            "target": n2,
            "distance": dist,
            "source_lat": G.nodes[n1]["lat"],
            "source_lng": G.nodes[n1]["lng"],
            "target_lat": G.nodes[n2]["lat"],
            "target_lng": G.nodes[n2]["lng"]
        })
    
    return jsonify({
        "center": area_data["center"],
        "locality_name": area_data["name"],
        "nodes": nodes_with_info,
        "edges": edges_with_info,
        "euler_info": euler_info,
        "bins": bins,
        "stats": {
            "total_nodes": G.number_of_nodes(),
            "total_edges": G.number_of_edges(),
            "avg_degree": round(sum(dict(G.degree()).values()) / G.number_of_nodes(), 1),
            "total_distance": sum(d["weight"] for _, _, d in G.edges(data=True))
        }
    })

@app.route("/api/optimize/<city>/<locality>", methods=["GET"])
def optimize_route(city, locality):
    priority = request.args.get("priority", "all")
    
    if city not in AREAS:
        return jsonify({"error": "City not found"}), 404
    if locality not in AREAS[city]["localities"]:
        return jsonify({"error": "Locality not found"}), 404
    
    area_data = AREAS[city]["localities"][locality]
    G = build_graph(area_data)
    
    locality_seed = sum(ord(c) for c in locality)
    bins = generate_bins(area_data, seed=locality_seed)
    
    if priority == "full":
        filtered_bins = [b for b in bins if b["status"] == "Full"]
    elif priority == "critical":
        filtered_bins = [b for b in bins if b["status"] == "Critical"]
    elif priority == "critical_full":
        filtered_bins = [b for b in bins if b["status"] in ["Full", "Critical"]]
    else:
        filtered_bins = bins
    
    filtered_node_ids = {b["node_id"] for b in filtered_bins}
    
    if filtered_node_ids:
        subgraph_nodes = set()
        for node in G.nodes():
            if node in filtered_node_ids:
                subgraph_nodes.add(node)
            else:
                for neighbor in G.neighbors(node):
                    if neighbor in filtered_node_ids:
                        subgraph_nodes.add(node)
                        subgraph_nodes.add(neighbor)
        
        if subgraph_nodes:
            sub_G = G.subgraph(subgraph_nodes).copy()
        else:
            sub_G = G
    else:
        sub_G = G
    
    euler_result = find_euler_route(sub_G)
    
    route_with_coords = []
    for u, v in euler_result["route"]:
        route_with_coords.append({
            "from": u,
            "to": v,
            "from_lat": G.nodes[u]["lat"],
            "from_lng": G.nodes[u]["lng"],
            "to_lat": G.nodes[v]["lat"],
            "to_lng": G.nodes[v]["lng"],
            "distance": G[u][v]["weight"]
        })
    
    traditional_distance = euler_result["distance"] * 1.45
    traditional_time = traditional_distance / 30
    optimized_time = euler_result["distance"] / 30
    
    total_waste_kg = sum(b["fill_level"] * 0.5 for b in bins)
    co2_saved_kg = (traditional_distance - euler_result["distance"]) * 0.0012
    
    analytics = {
        "roads_covered": G.number_of_edges(),
        "total_distance": sum(d["weight"] for _, _, d in G.edges(data=True)),
        "optimized_distance": euler_result["distance"],
        "distance_saved": traditional_distance - euler_result["distance"],
        "distance_saved_pct": round((1 - euler_result["distance"] / traditional_distance) * 100, 1),
        "fuel_saved_liters": round((traditional_distance - euler_result["distance"]) * 0.05, 2),
        "fuel_saved_pct": round((1 - euler_result["distance"] / traditional_distance) * 100, 1),
        "traditional_time_minutes": round(traditional_time, 1),
        "optimized_time_minutes": round(optimized_time, 1),
        "time_saved_minutes": round(traditional_time - optimized_time, 1),
        "collection_efficiency": round((1 - euler_result["repeated_edges"] / max(euler_result["edges_covered"], 1)) * 100, 1),
        "avg_bin_fill": round(sum(b["fill_level"] for b in bins) / len(bins), 1),
        "total_bins": len(bins),
        "critical_bins": len([b for b in bins if b["status"] == "Critical"]),
        "full_bins": len([b for b in bins if b["status"] == "Full"]),
        "medium_bins": len([b for b in bins if b["status"] == "Medium"]),
        "empty_bins": len([b for b in bins if b["status"] == "Empty"]),
        "total_waste_collected_kg": round(total_waste_kg, 1),
        "co2_reduction_kg": round(co2_saved_kg, 2),
        "algorithm": euler_result["type"],
        "euler_info": euler_result["info"]
    }
    
    comparison = {
        "traditional": {
            "distance_meters": round(traditional_distance),
            "time_minutes": round(traditional_time, 1),
            "fuel_liters": round(traditional_distance * 0.05, 2),
            "repeated_roads": euler_result["repeated_edges"] + random.randint(3, 8),
            "efficiency": round(random.uniform(45, 60), 1)
        },
        "optimized": {
            "distance_meters": euler_result["distance"],
            "time_minutes": round(optimized_time, 1),
            "fuel_liters": round(euler_result["distance"] * 0.05, 2),
            "repeated_roads": euler_result["repeated_edges"],
            "efficiency": analytics["collection_efficiency"]
        }
    }
    
    return jsonify({
        "route": route_with_coords,
        "euler_result": euler_result,
        "analytics": analytics,
        "comparison": comparison,
        "bins": bins
    })

@app.route("/api/analytics/<city>/<locality>", methods=["GET"])
def get_analytics(city, locality):
    if city not in AREAS:
        return jsonify({"error": "City not found"}), 404
    if locality not in AREAS[city]["localities"]:
        return jsonify({"error": "Locality not found"}), 404
    
    area_data = AREAS[city]["localities"][locality]
    G = build_graph(area_data)
    
    locality_seed = sum(ord(c) for c in locality)
    bins = generate_bins(area_data, seed=locality_seed)
    
    analytics = {
        "roads_covered": G.number_of_edges(),
        "total_distance": sum(d["weight"] for _, _, d in G.edges(data=True)),
        "avg_bin_fill": round(sum(b["fill_level"] for b in bins) / len(bins), 1),
        "total_waste_collected_kg": round(sum(b["fill_level"] * 0.5 for b in bins), 1),
        "co2_reduction_kg": round(random.uniform(1.5, 5.0), 2),
        "bin_distribution": {
            "critical": len([b for b in bins if b["status"] == "Critical"]),
            "full": len([b for b in bins if b["status"] == "Full"]),
            "medium": len([b for b in bins if b["status"] == "Medium"]),
            "empty": len([b for b in bins if b["status"] == "Empty"])
        },
        "daily_collection_data": [
            {"day": "Mon", "collected": random.randint(80, 100), "skipped": random.randint(0, 10)},
            {"day": "Tue", "collected": random.randint(80, 100), "skipped": random.randint(0, 10)},
            {"day": "Wed", "collected": random.randint(80, 100), "skipped": random.randint(0, 10)},
            {"day": "Thu", "collected": random.randint(80, 100), "skipped": random.randint(0, 10)},
            {"day": "Fri", "collected": random.randint(80, 100), "skipped": random.randint(0, 10)},
            {"day": "Sat", "collected": random.randint(80, 100), "skipped": random.randint(0, 10)},
            {"day": "Sun", "collected": random.randint(60, 90), "skipped": random.randint(5, 15)},
        ],
        "weekly_distance_data": [
            {"week": "W1", "traditional": random.randint(4000, 6000), "optimized": random.randint(2800, 4000)},
            {"week": "W2", "traditional": random.randint(4000, 6000), "optimized": random.randint(2800, 4000)},
            {"week": "W3", "traditional": random.randint(4000, 6000), "optimized": random.randint(2800, 4000)},
            {"week": "W4", "traditional": random.randint(4000, 6000), "optimized": random.randint(2800, 4000)},
        ],
        "fuel_consumption": [
            {"name": "Diesel", "traditional": random.randint(80, 140), "optimized": random.randint(55, 95)},
            {"name": "CNG", "traditional": random.randint(70, 120), "optimized": random.randint(48, 82)},
            {"name": "Electric", "traditional": random.randint(30, 55), "optimized": random.randint(20, 38)},
        ]
    }
    
    return jsonify(analytics)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )

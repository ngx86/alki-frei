import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import ARRAY
from geoalchemy2 import Geometry
from flask_cors import CORS

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)  # Enable CORS for all routes

# Use environment variable for database URL
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'postgresql://username:password@localhost/beerdatabase')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class Beer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brewery_name = db.Column(db.String(100), nullable=False)
    beer_name = db.Column(db.String(100), nullable=False)
    style = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Float)
    abv = db.Column(db.Float)
    flavor_profile = db.Column(ARRAY(db.String(50)))
    ingredients = db.Column(ARRAY(db.String(50)))
    location = db.Column(db.String(100))
    rating = db.Column(db.Float)
    packaging_type = db.Column(db.String(50))
    availability = db.Column(db.String(50))
    serving_temperature = db.Column(db.String(50))
    calories = db.Column(db.Integer)
    nutritional_info = db.Column(db.JSON)
    distributor = db.Column(db.String(100))
    special_features = db.Column(ARRAY(db.String(50)))
    pairing_suggestions = db.Column(ARRAY(db.String(100)))
    brewery_details = db.Column(db.JSON)
    user_tags = db.Column(ARRAY(db.String(50)))
    popularity_score = db.Column(db.Float)
    geolocation = db.Column(Geometry(geometry_type='POINT', srid=4326))

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/beer', methods=['POST'])
def add_beer():
    data = request.json
    new_beer = Beer(
        brewery_name=data['brewery_name'],
        beer_name=data['beer_name'],
        style=data['style'],
        price=data.get('price'),
        abv=data.get('abv'),
        flavor_profile=data.get('flavor_profile'),
        ingredients=data.get('ingredients'),
        location=data.get('location'),
        rating=data.get('rating'),
        packaging_type=data.get('packaging_type'),
        availability=data.get('availability'),
        serving_temperature=data.get('serving_temperature'),
        calories=data.get('calories'),
        nutritional_info=data.get('nutritional_info'),
        distributor=data.get('distributor'),
        special_features=data.get('special_features'),
        pairing_suggestions=data.get('pairing_suggestions'),
        brewery_details=data.get('brewery_details'),
        user_tags=data.get('user_tags'),
        popularity_score=data.get('popularity_score'),
        geolocation=f"POINT({data.get('longitude')} {data.get('latitude')})"
    )
    db.session.add(new_beer)
    db.session.commit()
    return jsonify({"message": "Beer added successfully"}), 201

@app.route('/api/beers', methods=['GET'])
def get_beers():
    beers = Beer.query.all()
    return jsonify([{
        'id': beer.id,
        'brewery_name': beer.brewery_name,
        'beer_name': beer.beer_name,
        'style': beer.style,
        'price': beer.price,
        'abv': beer.abv,
        # Add other fields as needed
    } for beer in beers])

@app.route('/api/beer/<int:id>', methods=['GET'])
def get_beer(id):
    beer = Beer.query.get_or_404(id)
    return jsonify({
        'id': beer.id,
        'brewery_name': beer.brewery_name,
        'beer_name': beer.beer_name,
        'style': beer.style,
        'price': beer.price,
        'abv': beer.abv,
        # Add other fields as needed
    })

@app.errorhandler(404)
def not_found(e):
    return jsonify(error=str(e)), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify(error=str(e)), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)

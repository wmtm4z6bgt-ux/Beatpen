from flask import Flask, render_template, request, redirect, url_for 

app = Flask(__name__)
# Главная страница
@app.route('/')
def index():
    return render_template('index.html')
@app.route('/generate_test', methods=['POST'])
def generate_test():
    data = request.json
    sphere = data.get('sphere', 'General Tech')

if __name__ == '__main__':
    app.run(debug=True, port=5001)
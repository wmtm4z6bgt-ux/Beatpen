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
    
    # Формируем промпт для ИИ
    prompt = f"""
    Generate a professional skill assessment test for the sphere: {sphere}.
    Return ONLY a JSON object with the following structure:
    {{
      "test_name": "Skill Evaluation",
      "questions": [
        {{
          "id": 1,
          "question": "Text of the question",
          "options": ["A", "B", "C", "D"],
          "correct_answer": "A"
        }}
      ]
    }}
    Generate 5 high-quality questions.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        # Отправляем сгенерированный тест на фронтенд
        return response.choices[0].message.content
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
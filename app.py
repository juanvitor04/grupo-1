from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = 'segredo'  # Necessário para usar flash

# Usuário de exemplo
USUARIO_CORRETO = "admin"
SENHA_CORRETA = "1234"

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form['usuario']
        senha = request.form['senha']

        if usuario == USUARIO_CORRETO and senha == SENHA_CORRETA:
            return "<h1>Login bem-sucedido!</h1>"
        else:
            flash('Usuário ou senha incorretos')
            return redirect(url_for('login'))

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

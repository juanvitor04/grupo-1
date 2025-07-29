from flask import Flask, render_template, request, redirect, url_for, flash, session
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'segredo'

def get_db_connection():
    conn = sqlite3.connect('banco.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        usuario = request.form['usuario']
        senha = request.form['senha']

        conn = get_db_connection()
        user = conn.execute('SELECT * FROM usuarios WHERE nome = ?', (usuario,)).fetchone()
        conn.close()

        if user and check_password_hash(user['senha'], senha):
            session['usuario'] = usuario
            return redirect(url_for('jogo'))
        else:
            flash('Usuário ou senha incorretos')
            return redirect(url_for('login'))

    return render_template('index.html')

@app.route('/jogo')
def jogo():
    if 'usuario' not in session:
        return redirect(url_for('login'))
    return render_template('jogo.html', usuario=session['usuario'])

@app.route('/logout')
def logout():
    session.pop('usuario', None)
    return redirect(url_for('login'))

@app.route('/cadastro', methods=['GET', 'POST'])
def cadastro():
    if request.method == 'POST':
        usuario = request.form['usuario']
        senha = request.form['senha']
        senha_hash = generate_password_hash(senha)

        conn = get_db_connection()
        try:
            conn.execute('INSERT INTO usuarios (nome, senha) VALUES (?, ?)', (usuario, senha_hash))
            conn.commit()
            flash('Usuário cadastrado com sucesso!')
            return redirect(url_for('login'))
        except sqlite3.IntegrityError:
            flash('Usuário já existe!')
            return redirect(url_for('cadastro'))
        finally:
            conn.close()

    return render_template('cadastro.html')

if __name__ == '__main__':
    app.run(debug=True)
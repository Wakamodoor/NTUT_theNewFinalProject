from flask import Flask , jsonify , request ,render_template
from flask_cors import CORS
import MySQLdb as mariadb
import json

app = Flask(__name__)
CORS(app)

stores = [
    {
        'name' : 'cool store',
        'items' : [
            {
                'name':'cool item',
                'price':9.99
            }
        ]
    }
]

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/store')
def get_stores():
    return jsonify({'store':stores})

@app.route('/test')
def get_test():
    
    db = mariadb.connect(host="localhost",user="root",db="forumors")

    cursor = db.cursor()

    userid= "5351047"


    selectSQL = "SELECT articleid,time FROM comment WHERE userid=%s "

    cursor.execute(selectSQL %userid)

    #cursor.execute("SELECT articleid,time FROM comment WHERE userid = 5351047")

    result = cursor.fetchall()

    for raw in result:{
        print(raw)
    }

    return jsonify(result)

@app.route('/chart_1/<string:username>',methods=['GET'])
def get_chart1(username):

    name = str(username)

    db = mariadb.connect(host="localhost",user="root",db="forumors")

    cursor = db.cursor()

    #selectSQL = "SELECT * FROM comment WHERE username = "+" ' "+ "%s" +"'"

    selectSQL = "SELECT year(TIME) AS 年份, MONTH(TIME) AS 月份 ,username,count(*) as 每月發文量 FROM `comment` where  username = "+"'"  + "%s"+"'"  + " GROUP BY  月份,username order BY  time,username"

    print(selectSQL %name)

    cursor.execute(selectSQL %name)

    result = cursor.fetchall()

    return jsonify(result)

import decimal
from flask import Flask , jsonify , request ,render_template
import MySQLdb as mariadb
import json
from flask_cors import CORS

class DecimalEncoder(json.JSONEncoder):
    def default(self,o):
        if isinstance(o, decimal.Decimal):
            return float(o)
        super(DecimalEncoder , self).default(o)

db = mariadb.connect(host="localhost",user="root",db="forumors")

cursor = db.cursor(cursorclass=mariadb.cursors.DictCursor)

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

    userid= "5351047"

    selectSQL = "SELECT articleid,time FROM comment WHERE userid=%s "

    cursor.execute(selectSQL %userid)

    result = cursor.fetchall()

    return jsonify(result)

@app.route('/chart_evergreen' , methods=['GET'])
def get_chart_evergreen():

    selectSQL = "SELECT year(datetime) AS year, MONTH(datetime) AS month ,sum(volume) AS sumVol ,round(avg(endprice),2) as avgClose,count(*) as countDay FROM evergreenprice GROUP BY  month,year order BY  datetime"

    cursor.execute(selectSQL )

    result = cursor.fetchall()

    return json.dumps(result , cls=DecimalEncoder ,ensure_ascii=False)

@app.route('/chart_1/<string:username>',methods=['GET'])
def get_chart1(username):

    name = str(username)

    selectSQL = "SELECT year(datetime) AS year, MONTH(datetime) AS month ,username,count(*) as volOfMonth FROM `evergreencomment` where  username = " + "'"  + "%s" + "'"  + " GROUP BY year,month,username order BY  datetime,username"

    cursor.execute(selectSQL %name)

    result = cursor.fetchall()

    return json.dumps(result , cls = DecimalEncoder ,ensure_ascii=False)

import decimal
from flask import Flask , jsonify , request ,render_template
import MySQLdb as mariadb
import json
from flask_cors import CORS
import re
import jieba
import jieba.analyse
import pandas as pd

class DecimalEncoder(json.JSONEncoder):
    def default(self,o):
        if isinstance(o, decimal.Decimal):
            return float(o)
        super(DecimalEncoder , self).default(o)

#db = mariadb.connect(host="localhost",user="root",db="forumors")
db = mariadb.connect(host="localhost",user="root",db="forumors")

cursor = db.cursor(cursorclass=mariadb.cursors.DictCursor)

jieba.load_userdict(r'C:\Users\Niennnnlee\Desktop\coding\大學專題\Flangular\backend\jieba dict.txt')
stopwords = [line.strip() for line in open(r'C:\Users\Niennnnlee\Desktop\coding\大學專題\Flangular\backend\stopwords.txt', 'r', encoding='utf-8').readlines()]
# jieba.load_userdict(r'D:\北科\專題\NTUT_theNewFinalProject\backend\jieba dict.txt')
# stopwords = [line.strip() for line in open(r'D:\北科\專題\NTUT_theNewFinalProject\backend\stopwords.txt', 'r', encoding='utf-8').readlines()]

app = Flask(__name__)
app.debug=True
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

@app.route('/evergreen/chart_1/<string:username>',methods=['GET'])
def get_chart1(username):

    name = str(username)

    selectSQL = "SELECT year(datetime) AS year, MONTH(datetime) AS month ,username,count(*) as volOfMonth FROM `evergreencomment` where  username = " + "'"  + "%s" + "'"  + " GROUP BY year,month,username order BY  datetime,username"

    cursor.execute(selectSQL %name)

    result = cursor.fetchall()

    return json.dumps(result , cls = DecimalEncoder ,ensure_ascii=False)

@app.route('/evergreen/wordcloud/<string:username>')
def get_wordcould(username):

    # request_data=request.get_json()

    # starttime=request_data['starttime']
    # endtime=request_data['endtime']

    starttime=request.args.get('starttime')
    endtime=request.args.get('endtime')

    selectSQL = "SELECT comment FROM `evergreencomment` where  username = " + "'"  + "%s" + "'"  + " AND datetime between "+ "'"  + "%s" + "'" + "AND" + "'"  + "%s" + "'" 
    
    cursor.execute(selectSQL %(username ,starttime ,endtime))

    result = cursor.fetchall()

    totalstring=''

    for dic in result:
        totalstring+=dic['comment']

    sentence_list = re.split(r'[^\w ]', totalstring)

    word_list=[]
    for i in sentence_list:
        seg_list = jieba.lcut(i)
        for r in seg_list:
            if r not in stopwords and r != ' ':
                word_list.append(r)
    word_cnt = {}  #定義字典，鍵:值
    for word in word_list:       
        word_cnt[word] = word_cnt.get(word, 0) + 1

    sorted_word_cnt = sorted(word_cnt.items(), key=lambda kv: kv[1], reverse=True)

    return(json.dumps(sorted_word_cnt))

# <<<<<<< HEAD
# @app.route("/test02")
# def testSQL():

#     selectSQL = "SELECT year(datetime) AS year, MONTH(DATETIME) AS month , username , count(COMMENT) FROM foxconncomment WHERE username = 'kewei' group by year ,month "

#     cursor.execute(selectSQL)

#     result = cursor.fetchall()

# =======
@app.route('/evergreen/ranking')
def get_rankbymonth():

    starttime=request.args.get('starttime')
    endtime=request.args.get('endtime')

    
    selectSQL = "SELECT * FROM (select YEAR(datetime) as 年份,month(datetime) as 月份,username ,count(*) as commentbymonth , ROW_NUMBER() over (order by COUNT(*) DESC) as ranking from evergreencomment WHERE (DATETIME BETWEEN '" + " %s " + "' AND '" + " %s " + "')   GROUP BY 年份,月份,username order by ranking ) AS a WHERE a.ranking <=5"

    print(selectSQL %(starttime , endtime))

    cursor.execute(selectSQL %(starttime , endtime))

    result = cursor.fetchall()

    print(result)

# >>>>>>> 65357666dcfd38f59b54b8bbaa2ca2007b1f899d
    return(json.dumps(result))
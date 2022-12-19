import decimal
from flask import Flask , jsonify , request ,render_template
import model
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

db = mariadb.connect(host="localhost",user="root",db="forumors")
# db = mariadb.connect(host="localhost",user="root",password="root",db="forumors")

cursor = db.cursor(cursorclass=mariadb.cursors.DictCursor)

jieba.load_userdict(r'./jieba dict.txt')
stopwords = [line.strip() for line in open(r'./stopwords.txt', 'r', encoding='utf-8').readlines()]

poswords =  [line.strip() for line in open(r'./our_dict_positive_v2.txt', 'r', encoding='utf-8').readlines()]
negwords = [line.strip() for line in open(r'./our_dict_negative_v2.txt', 'r', encoding='utf-8').readlines()]
stawords = [line.strip() for line in open(r'./our_dict_v2.txt', 'r', encoding='utf-8').readlines()]


app = Flask(__name__)
app.debug=True
CORS(app)

if __name__ =='__main__':
    app.run(threaded=True)

#長榮股價
@app.route('/chart_evergreen' , methods=['GET'])
def get_chart_evergreen():

    selectSQL = "SELECT year(datetime) AS year, MONTH(datetime) AS month ,sum(volume) AS sumVol ,round(avg(endprice),2) as avgClose,count(*) as countDay FROM evergreenprice GROUP BY  month,year order BY  datetime"

    cursor.execute(selectSQL)

    result = cursor.fetchall()

    return json.dumps(result , cls=DecimalEncoder ,ensure_ascii=False)


#鴻海股價
@app.route('/chart_foxconn' , methods=['GET'])
def get_chart_foxconnconmment():

    selectSQL = "SELECT year(datetime) AS year, MONTH(datetime) AS month ,sum(volume) AS sumVol ,round(avg(endprice),2) as avgClose,count(*) as countDay FROM foxconnprice GROUP BY  month,year order BY  datetime"

    cursor.execute(selectSQL)

    result = cursor.fetchall()

    return json.dumps(result , cls=DecimalEncoder ,ensure_ascii=False)

#長榮用戶月發文量
@app.route('/evergreen/chart_1/<string:username>',methods=['GET'])
def get_evergreenchart1(username):

    name = str(username)

    selectSQL = "SELECT year(datetime) AS year, MONTH(datetime) AS month ,username,count(*) as volOfMonth FROM `evergreencomment` where  username = " + "'"  + "%s" + "'"  + " GROUP BY year,month,username order BY  datetime,username"

    cursor.execute(selectSQL %name)

    result = cursor.fetchall()

    return json.dumps(result , cls = DecimalEncoder ,ensure_ascii=False)

#鴻海用戶月發文量
@app.route('/foxconn/chart_1/<string:username>',methods=['GET'])
def get_foxconnchart1(username):

    name = str(username)

    selectSQL = "SELECT year(datetime) AS year, MONTH(datetime) AS month ,username,count(*) as volOfMonth FROM `foxconncomment` where  username = " + "'"  + "%s" + "'"  + " GROUP BY year,month,username order BY  datetime,username"

    cursor.execute(selectSQL %name)

    result = cursor.fetchall()

    return json.dumps(result , cls = DecimalEncoder ,ensure_ascii=False)

#長榮用戶在一段時間的文字雲
@app.route('/evergreen/wordcloud/<string:username>')
def get_evergreenwordcould(username):

    starttime=request.args.get('starttime')
    endtime=request.args.get('endtime')

    selectSQL = "SELECT comment FROM `evergreencomment` where  username = " + "'"  + "%s" + "'"  + " AND datetime between "+ "'"  + "%s" + "'" + "AND" + "'"  + "%s" + "'" 
    
    cursor.execute(selectSQL %(username ,starttime ,endtime))

    result = cursor.fetchall()

    totalstring=''

    for dic in result:
        totalstring+=dic['comment']

    onlychinesestring = re.sub ('[^\u4e00-\u9fa5]','',totalstring)

    sentence_list = re.split(r'[^\w ]', onlychinesestring)

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


#鴻海用戶在一段時間的文字雲
@app.route('/foxconn/wordcloud/<string:username>')
def get_foxconnwordcould(username):

    starttime=request.args.get('starttime')
    endtime=request.args.get('endtime')

    selectSQL = "SELECT comment FROM `foxconncomment` where  username = " + "'"  + "%s" + "'"  + " AND datetime between "+ "'"  + "%s" + "'" + "AND" + "'"  + "%s" + "'" 
    
    cursor.execute(selectSQL %(username ,starttime ,endtime))

    result = cursor.fetchall()

    totalstring=''

    for dic in result:
        totalstring+=dic['comment']

    onlychinesestring = re.sub ('[^\u4e00-\u9fa5]','',totalstring)

    sentence_list = re.split(r'[^\w ]', onlychinesestring)

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

#長榮一個月的發文量前五名
@app.route('/evergreen/ranking')
def get_evergreenrankbymonth():

    year=request.args.get('year')
    month=request.args.get('month')

    
    selectSQL = "SELECT * FROM (select YEAR(datetime) as 年份,month(datetime) as 月份,username ,count(*) as commentbymonth , SUM(commentlike) , SUM(commentresponse) , ROW_NUMBER() over (order by COUNT(*) DESC) as ranking from evergreencomment WHERE (YEAR(datetime) = " + "'" + "%s" + "'" + "AND MONTH(datetime) = " + "%s" + " ) GROUP BY 年份,月份,username order by ranking ) AS a WHERE a.ranking <=5"


    cursor.execute(selectSQL %(year , month))

    result = cursor.fetchall()

    return json.dumps(result , cls = DecimalEncoder ,ensure_ascii=False)



#鴻海一個月的發文量前五名
@app.route('/foxconn/ranking')
def get_foxconnrankbymonth():

    year=request.args.get('year')
    month=request.args.get('month')

    
    selectSQL = "SELECT * FROM (select YEAR(datetime) as 年份,month(datetime) as 月份,username ,count(*) as commentbymonth , SUM(commentlike) , SUM(commentresponse) , ROW_NUMBER() over (order by COUNT(*) DESC) as ranking from foxconncomment WHERE (YEAR(datetime) = " + "'" + "%s" + "'" + "AND MONTH(datetime) = " + "%s" + " ) GROUP BY 年份,月份,username order by ranking ) AS a WHERE a.ranking <=5"


    cursor.execute(selectSQL %(year , month))

    result = cursor.fetchall()

    return json.dumps(result , cls = DecimalEncoder ,ensure_ascii=False)


#長榮用戶在一個月內發文的篇數
@app.route('/evegreen/dailypost/<string:username>')
def get_evergreendailypost(username):

    year=request.args.get('year')
    month=request.args.get('month')

    selectSQL = "SELECT DATE(DATETIME) AS 日期 ,username, COUNT(`comment`) AS 日發文數 FROM evergreencomment WHERE username = " + "'" + "%s" +  "'" + "AND YEAR(DATETIME) = " + "'" + "%s" + "'" + " AND MONTH(DATETIME) = " + "'" + "%s" + "'" + "GROUP BY  DATE(datetime)"

    cursor.execute(selectSQL %(username ,year , month))

    result = cursor.fetchall()

    return json.dumps(result , cls = DecimalEncoder ,ensure_ascii=False ,default=str)


#鴻海用戶在一個月內發文的篇數
@app.route('/foxconn/dailypost/<string:username>')
def get_foxconndailypost(username):

    year=request.args.get('year')
    month=request.args.get('month')

    selectSQL = "SELECT DATE(DATETIME) AS 日期 ,username, COUNT(`comment`) AS 日發文數 FROM foxconncomment WHERE username = " + "'" + "%s" +  "'" + "AND YEAR(DATETIME) = " + "'" + "%s" + "'" + " AND MONTH(DATETIME) = " + "'" + "%s" + "'" + "GROUP BY  DATE(datetime)"

    cursor.execute(selectSQL %(username ,year , month))

    result = cursor.fetchall()

    return json.dumps(result , cls = DecimalEncoder ,ensure_ascii=False ,default=str)


#長榮一個月全部發文的詞頻
@app.route('/evegreen/monthlywordcloud')
def get_evergreenmonthlywordcloud():

    year=request.args.get('year')
    month=request.args.get('month')

    selectSQL = "SELECT comment FROM `evergreencomment` where  YEAR(DATETIME) = " + "'" + "%s" + "'" + " AND MONTH(DATETIME) = " + "'" + "%s" + "'"

    cursor.execute(selectSQL %(year ,month))

    result = cursor.fetchall()

    totalstring=''

    for dic in result:
        totalstring+=dic['comment']

    onlychinesestring = re.sub ('[^\u4e00-\u9fa5]','',totalstring)

    sentence_list = re.split(r'[^\w ]', onlychinesestring)

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


#鴻海一個月全部發文的詞頻
@app.route('/foxconn/monthlywordcloud')
def get_foxconnmonthlywordcloud():

    year=request.args.get('year')
    month=request.args.get('month')

    selectSQL = "SELECT comment FROM `foxconncomment` where  YEAR(DATETIME) = " + "'" + "%s" + "'" + " AND MONTH(DATETIME) = " + "'" + "%s" + "'"

    cursor.execute(selectSQL %(year ,month))

    result = cursor.fetchall()

    totalstring=''

    for dic in result:
        totalstring+=dic['comment']

    onlychinesestring = re.sub ('[^\u4e00-\u9fa5]','',totalstring)

    sentence_list = re.split(r'[^\w ]', onlychinesestring)

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

#預測文章類型
@app.route('/predict', methods=['POST'])
def postInput():
    # 取得前端傳過來的數值
    insertValues = request.get_json()
    article=insertValues['article']
    input = str(article)


    result = model.predict(input)
    return jsonify({'發文者類型': result,'情緒意味':"看漲看跌"})


#長榮一個月內用戶的發文頻率
@app.route('/evergreen/user/monthlywordcloud')
def get_evergreenusermonthlywordcloud():

    year=request.args.get('year')
    month=request.args.get('month')

    selectSQL = "SELECT username , count(*) AS 當月發文數 FROM `evergreencomment` where  YEAR(DATETIME) = " + "'" + "%s" + "'" + " AND MONTH(DATETIME) = " + "'" + "%s" + "'" + " GROUP BY username ORDER BY count(*) DESC"

    cursor.execute(selectSQL %(year ,month))

    result = cursor.fetchall()

    return jsonify(result)

#鴻海一個月內用戶的發文頻率
@app.route('/foxconn/user/monthlywordcloud')
def get_foxconnusermonthlywordcloud():

    year=request.args.get('year')
    month=request.args.get('month')

    selectSQL = "SELECT username , count(*) AS 當月發文數 FROM `foxconncomment` where  YEAR(DATETIME) = " + "'" + "%s" + "'" + " AND MONTH(DATETIME) = " + "'" + "%s" + "'" + " GROUP BY username ORDER BY count(*) DESC"

    cursor.execute(selectSQL %(year ,month))

    result = cursor.fetchall()

    return jsonify(result)


#長榮一個月內的每日價格
@app.route('/evergreen/dailyprice')
def get_evergreenprice():

    year=request.args.get('year')
    month=request.args.get('month')

    selectSQL = "SELECT DATE(DATETIME) , endprice FROM evergreenprice WHERE YEAR(DATETIME) =" + "'" + "%s" + "'" + " AND MONTH(DATETIME) = " + "'" + "%s" + "'"

    cursor.execute(selectSQL %(year ,month))

    result = cursor.fetchall()

    return json.dumps(result , cls = DecimalEncoder ,ensure_ascii=False ,default=str)

#鴻海一個月內的每日價格
@app.route('/foxconn/dailyprice')
def get_foxconnprice():

    year=request.args.get('year')
    month=request.args.get('month')

    selectSQL = "SELECT DATE(DATETIME) , endprice FROM foxconnprice WHERE YEAR(DATETIME) =" + "'" + "%s" + "'" + " AND MONTH(DATETIME) = " + "'" + "%s" + "'"

    cursor.execute(selectSQL %(year ,month))

    result = cursor.fetchall()

    return json.dumps(result , cls = DecimalEncoder ,ensure_ascii=False ,default=str)

#長榮用戶一天的發文類型
@app.route('/evergreen/predict/people', methods=['POST'])
def predictevergreenbypeople():

    insertValues = request.get_json()
    username=insertValues['username']
    date=insertValues['date']

    cursor.execute(f"SELECT comment FROM `evergreencomment` where username = \'{username}\' and date(datetime) = \'{date}\'")

    result = cursor.fetchall()

    a=0 ;b=0;c=0
    for i in range(len(result)):
        input_tuple=result[i]
        input=str(input_tuple)
        result_pred=model.predict(input)
        if result_pred=="機器人":
            a=a+1
        elif result_pred=="分析師":
            b=b+1
        else:
            c=c+1
    #比大小
    if a>b:
        if a>c:
            result='機器人'
        else:
            result='散戶'
    elif a<b:
        if b>c:
            result='分析師'
        else:
            result='散戶'
    else:
        result='一樣'

    return jsonify({'發文者類型':result,"機器人文章數":a,"分析師文章數":b,"散戶文章數":c})


#鴻海用戶一天的發文類型
@app.route('/foxconn/predict/people', methods=['POST'])
def predictfoxconnbypeople():

    insertValues = request.get_json()
    username=insertValues['username']
    date=insertValues['date']

    cursor.execute(f"SELECT comment FROM `foxconncomment` where username = \'{username}\' and date(datetime) = \'{date}\'")

    result = cursor.fetchall()

    a=0 ;b=0;c=0
    for i in range(len(result)):
        input_tuple=result[i]
        input=str(input_tuple)
        result_pred=model.predict(input)
        if result_pred=="機器人":
            a=a+1
        elif result_pred=="分析師":
            b=b+1
        else:
            c=c+1
    #比大小
    if a>b:
        if a>c:
            result='機器人'
        else:
            result='散戶'
    elif a<b:
        if b>c:
            result='分析師'
        else:
            result='散戶'
    else:
        result='一樣'

    return jsonify({'發文者類型':result,"機器人文章數":a,"分析師文章數":b,"散戶文章數":c})

#長榮用戶發文情緒字數計算
@app.route('/evergreen/ranking/emotion/<string:username>')
def getevergreenrankingpeopleemotion(username):

    year=request.args.get('year')
    month=request.args.get('month')

    cursor.execute(f"SELECT comment FROM `evergreencomment` where username = \'{username}\' and year(datetime) = \'{year}\' and month(datetime) = \'{month}\'")

    result = cursor.fetchall()

    totalstring=''

    for dic in result:
        totalstring+=dic['comment']

    onlychinesestring = re.sub ('[^\u4e00-\u9fa5]','',totalstring)

    sentence_list = re.split(r'[^\w ]', onlychinesestring)

    word_list=[]
    for i in sentence_list:
        seg_list = jieba.lcut(i)
        for r in seg_list:
            if r not in stopwords and r != ' ':
                word_list.append(r)

    poswordstimes=0
    negwordstimes=0
    stawordstimes=0
    for word in word_list:
        if word in poswords:
            poswordstimes+=1
        elif word in negwords:
            negwordstimes+=1
        elif word in stawords:
            stawordstimes+=1

    return jsonify({ "正向字詞次數" : poswordstimes , "負向字詞次數" : negwordstimes , "中立字詞次數":stawordstimes})


#鴻海用戶發文情緒字數計算
@app.route('/foxconn/ranking/emotion/<string:username>')
def getfoxconnrankingpeopleemotion(username):

    year=request.args.get('year')
    month=request.args.get('month')

    cursor.execute(f"SELECT comment FROM `foxconncomment` where username = \'{username}\' and year(datetime) = \'{year}\' and month(datetime) = \'{month}\'")

    result = cursor.fetchall()

    totalstring=''

    for dic in result:
        totalstring+=dic['comment']

    onlychinesestring = re.sub ('[^\u4e00-\u9fa5]','',totalstring)

    sentence_list = re.split(r'[^\w ]', onlychinesestring)

    word_list=[]
    for i in sentence_list:
        seg_list = jieba.lcut(i)
        for r in seg_list:
            if r not in stopwords and r != ' ':
                word_list.append(r)

    poswordstimes=0
    negwordstimes=0
    stawordstimes=0
    for word in word_list:
        if word in poswords:
            poswordstimes+=1
        elif word in negwords:
            negwordstimes+=1
        elif word in stawords:
            stawordstimes+=1

    return jsonify({ "正向字詞次數" : poswordstimes , "負向字詞次數" : negwordstimes , "中立字詞次數":stawordstimes})

@app.route('/evergreen/monthly/emotion')
def getevergreenmonthlyemotion():

    year=request.args.get('year')
    month=request.args.get('month')

    cursor.execute(f"SELECT date(datetime) as date, comment FROM `evergreencomment` where  year(datetime) = \'{year}\' and month(datetime) = \'{month}\' group by comment order by date")

    result = cursor.fetchall()

    resultlist = list(result)

    days=[]
    comments=[]

    daytimes = -1

    for i in range(len(resultlist)):

        if resultlist[i]['date'] not in days:
            days.append(resultlist[i]['date'])
            comments.append(resultlist[i]['comment'])
            daytimes+=1
        else:
            comments[daytimes]+=resultlist[i]['comment']

    emotiondic=[]

    for r in range(len(comments)):

        onlychinesestring = re.sub ('[^\u4e00-\u9fa5]','',comments[r])

        sentence_list = re.split(r'[^\w ]', onlychinesestring)

        word_list=[]
        for i in sentence_list:
            seg_list = jieba.lcut(i)
        for r in seg_list:
            if r not in stopwords and r != ' ':
                word_list.append(r)

        poswordstimes=0
        negwordstimes=0
        stawordstimes=0
        for word in word_list:
            if word in poswords:
                poswordstimes+=1
            elif word in negwords:
                negwordstimes+=1
            elif word in stawords:
                stawordstimes+=1

        emotiondic.append([poswordstimes , negwordstimes , stawordstimes])

    returnlist = {}

    for j in range(len(days)):
        returnlist.setdefault(str(days[j]) , emotiondic[j] )

    return json.dumps(returnlist)

@app.route('/foxconn/monthly/emotion')
def getfoxconnmonthlyemotion():

    year=request.args.get('year')
    month=request.args.get('month')

    cursor.execute(f"SELECT date(datetime) as date, comment FROM `foxconncomment` where  year(datetime) = \'{year}\' and month(datetime) = \'{month}\' group by comment order by date")

    result = cursor.fetchall()

    resultlist = list(result)

    days=[]
    comments=[]

    daytimes = -1

    for i in range(len(resultlist)):

        if resultlist[i]['date'] not in days:
            days.append(resultlist[i]['date'])
            comments.append(resultlist[i]['comment'])
            daytimes+=1
        else:
            comments[daytimes]+=resultlist[i]['comment']

    emotiondic=[]

    for r in range(len(comments)):

        onlychinesestring = re.sub ('[^\u4e00-\u9fa5]','',comments[r])

        sentence_list = re.split(r'[^\w ]', onlychinesestring)

        word_list=[]
        for i in sentence_list:
            seg_list = jieba.lcut(i)
        for r in seg_list:
            if r not in stopwords and r != ' ':
                word_list.append(r)

        poswordstimes=0
        negwordstimes=0
        stawordstimes=0
        for word in word_list:
            if word in poswords:
                poswordstimes+=1
            elif word in negwords:
                negwordstimes+=1
            elif word in stawords:
                stawordstimes+=1

        emotiondic.append([poswordstimes , negwordstimes , stawordstimes])

    returnlist = {}

    for j in range(len(days)):
        returnlist.setdefault(str(days[j]) , emotiondic[j] )

    return json.dumps(returnlist)
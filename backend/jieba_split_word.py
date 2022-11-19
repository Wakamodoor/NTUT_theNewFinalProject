import jieba
import jieba.analyse
import pandas as pd
import csv

jieba.load_userdict('./senior project/jieba dict.txt')
df_articles_data = pd.read_csv('./senior project/趨勢king.csv')
articles_data = df_articles_data['留言'].to_list()
word_list = []

for i in articles_data:
    seg_list = jieba.lcut(i)
    stopwords = [line.strip() for line in open('./senior project/stopwords.txt', 'r', encoding='utf-8').readlines()]
    for word in seg_list:
        if word not in stopwords:
            if word != ' ':
                word_list.append(word)
                data_row = [word]
                with open('./senior project/split word done/趨勢king.csv', 'a', newline='', encoding='utf_8_sig') as f:                
                    csv_write = csv.writer(f)
                    csv_write.writerow(data_row)
                with open('./senior project/split word done/趨勢king.txt', 'a', newline='', encoding='utf_8_sig') as f:                
                    csv_write = csv.writer(f)
                    csv_write.writerow(data_row)
print(word_list)         
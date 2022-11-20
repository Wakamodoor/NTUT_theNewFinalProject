import re
import csv

def parse(text):
    
    text = re.sub(r'[^\w ]', ' ', text) #去除標點符號，產生間隔空白的字串
    word_list = text.split(' ') #以空白分開，產生list

    word_list = filter(None, word_list) #過濾不符合的元素，回傳新元素的list

    word_cnt = {}  #定義字典，鍵:值
    for word in word_list:       
        word_cnt[word] = word_cnt.get(word, 0) + 1  #字沒有出現過，就+1       
    '''    
        if word not in word_cnt:  上方程式碼的另一種寫法
            word_cnt[word] += 0
        word_cnt[word] += 1
        
    items = list(word_cnt.items())  下方程式碼的另一種寫法，差別在於這個是用list的方法排序  
    items.sort(key=lambda x:x[1], reverse=True)
    ''' 
    sorted_word_cnt = sorted(word_cnt.items(), key=lambda kv: kv[1], reverse=True)  #這個是用library裡的方法排序

    return sorted_word_cnt

with open('./senior project/split word done/趨勢king.txt', 'r', encoding='utf-8') as f:    
    text = f.read()  

word_and_count = parse(text)

for i in range (len(word_and_count)):
    word, count = word_and_count[i]
    print ("{:<10}{:>7}".format(word, count))
    
    data_row = [word, count]
    with open('./senior project/split word done/趨勢king詞頻.csv', 'a', newline='', encoding='utf_8_sig') as f:
        csv_write = csv.writer(f)
        csv_write.writerow(data_row)
    
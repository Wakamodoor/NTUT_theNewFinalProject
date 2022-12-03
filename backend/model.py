#載入訓練好的模型
# if __name__ == '__main__':  
#     from simpletransformers.classification import ClassificationModel
#     model = ClassificationModel('bert', 'outputs')

def predict(input):
    from simpletransformers.classification import ClassificationModel
    model = ClassificationModel('bert', 'outputs',use_cuda=False)
    #str_input=str(input)
    pred=model.predict([input])
    pred_label=pred[0][0]
    if   pred_label==0:
        result="機器人"
    elif pred_label==1:
        result="分析師"
    else:
        result="散戶"
    return result

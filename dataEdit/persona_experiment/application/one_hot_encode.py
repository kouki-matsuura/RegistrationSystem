import pandas as pd
import numpy as np
from sklearn.decomposition import PCA
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from math import dist
import pylab as pylab
from matplotlib import cm
from sklearn.metrics import silhouette_samples
import json
import collections as cl
import os
from pydrive.auth import GoogleAuth
from pydrive.drive import GoogleDrive

    #自動でgoogleフォームからペルソナ作成アンケートをダウンロードする
def csv_download():
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        gauth = GoogleAuth()
        gauth.LocalWebserverAuth()
        drive = GoogleDrive(gauth)

        file_id = drive.ListFile({'q': 'title = "ペルソナアンケート.csv"'}).GetList()
        f = drive.CreateFile({'id': file_id[0]['id']})
        f.GetContentFile(file_id[0]['title'], mimetype='text/csv')
    #one-hotエンコーディングを行い、新たなcsvファイルにアウトプットする
def encoding():
        df = pd.read_csv('ペルソナアンケート.csv', index_col=0)
        df_str = pd.read_csv('ペルソナアンケート.csv', index_col=0)
        df['物事の考え方を教えてください（3はどちらでもないを表す）その１'] =df['物事の考え方を教えてください（3はどちらでもないを表す）その１'].astype(object)
        df['物事の考え方を教えてください（3はどちらでもないを表す）その２'] =df['物事の考え方を教えてください（3はどちらでもないを表す）その２'].astype(object)
        df['学部卒業後は進学・就職のどちらの予定ですか（2:進学より 3:どちらでもない 4:就職より）']=df['学部卒業後は進学・就職のどちらの予定ですか（2:進学より 3:どちらでもない 4:就職より）'].astype(object)
        df['プログラミングは講義以外でどのくらいの頻度でしますか（3はどちらでもないを表す）'] =df['プログラミングは講義以外でどのくらいの頻度でしますか（3はどちらでもないを表す）'].astype(object)
        academic_number = df['学籍番号']
        del df['学籍番号']
        return academic_number, pd.get_dummies(df, dummy_na=True), df_str, academic_number[len(academic_number)-1]
    #主成分分析をし、説明変数に意味を持たせたまま、圧縮する
def pca(df):
        pca = PCA(10)
        existing_2d = pca.fit_transform(df)
        # 主成分得点
#        PCA_components.index = df.index
#        PCA_components.columns = ['PC1', 'PC2']
#        ax = PCA_components.plot(kind='scatter', x='PC2', y='PC1', figsize=(16,8))
#        for i, number in enumerate(academic_number):
#            ax.annotate(
#                number,
#                (PCA_components.iloc[i].PC2, PCA_components.iloc[i].PC1))
#            print(number)
#        plt.show()
        return existing_2d

def find_clusterNum_silhouette(datas):
        class_data_list = []
        result_class_num = 0

        loop_num = int(len(datas) * 0.9)
        for class_num in range(2, loop_num):
            km = KMeans(n_clusters=class_num,
                    init='k-means++',
                    n_init=10,
                    max_iter=300,
                    random_state=0)
            y_km = km.fit_predict(datas)
            cluster_labels = np.unique(y_km)
            silhouette_vals = silhouette_samples(datas, y_km, metric='euclidean')
            sil=[]
            for i,c in enumerate(cluster_labels):
                c_silhouette_vals = silhouette_vals[y_km==c]
                sil.append(len(c_silhouette_vals))

            data_diff = int(len(datas) * 0.2)
            data_diff_flg = max(sil) - min(sil) < data_diff
            ave_silhouette_vals = np.average(silhouette_vals)

            class_data_list.append({'class_num':class_num, 'data_diff':data_diff_flg, 'ave':ave_silhouette_vals})

        max_ave = 0
        for class_data in class_data_list:
            if class_data['data_diff'] and (max_ave < class_data['ave']):
                max_ave = class_data['ave']
                result_class_num = class_data['class_num']

        return result_class_num

def silhouette(class_num, datas):
        km = KMeans(n_clusters=class_num,
            init='k-means++',
            n_init=10,
            max_iter=300,
            random_state=0)

        # クラスタ分類→[2, 1, 0, 2, 3, 0, 2, 1, 1, 3]
        y_km = km.fit_predict(datas)

        # クラスタの重複をなくす→[0, 1, 2, 3]
        cluster_labels = np.unique(y_km)

        # 配列の数：指定したクラスタ数→４
        n_clusters = cluster_labels.shape[0]

        #シルエット係数を計算(引数：サンプルデータ, クラスター番号、ユークリッド距離でシルエット係数計算)
        silhouette_vals = silhouette_samples(datas,y_km,metric='euclidean')

        y_ax_lower, y_ax_upper = 0,0
        yticks = []
        for i,c in enumerate(cluster_labels):
            c_silhouette_vals = silhouette_vals[y_km==c]
            c_silhouette_vals.sort()
            # サンプルの個数を足していく
            y_ax_upper +=len(c_silhouette_vals)
            # グラフ表示の色を作成
            color=cm.jet(float(i)/n_clusters)
            # 棒グラフを作成
            pylab.barh(range(y_ax_lower,y_ax_upper),
            c_silhouette_vals,
            height=1.0,
            edgecolor='none',
            color=color
            )
            # クラスタラベルの表示位置
            yticks.append((y_ax_lower+y_ax_upper)/2.)
            # 底辺の値に棒の幅を足していく
            y_ax_lower += len(c_silhouette_vals)

        #平均の位置に線を引く
        silhouette_avg=np.mean(silhouette_vals)
        pylab.axvline(silhouette_avg,color="red",linestyle="--")
        pylab.title("シルエット法")
        pylab.ylabel("データ番号")
        pylab.xlabel("シルエット係数")


def k_means(datas, class_num):
        kmeans_mod = KMeans(n_clusters=class_num,
                            init='k-means++',
                            n_init=10,
                            max_iter=10,
                            random_state=0)
        idx = kmeans_mod.fit_predict(datas)
        #plt.scatter(datas[idx==0,0], datas[idx==0,1], color="b", s=10, alpha=0.5)
        #plt.scatter(datas[idx==1,0], datas[idx==1,1], color="c", s=10, alpha=0.5)
        #plt.scatter(datas[idx==2,0], datas[idx==2,1], color="y", s=10, alpha=0.5)
        #plt.scatter(kmeans_mod.cluster_centers_[:,0], kmeans_mod.cluster_centers_[:,1], color=["b", "c", "y"])
        #plt.xlabel('1次元の値')
        #plt.ylabel('2次元の値')
        return idx

def open_satisfaction_file():
        df = pd.read_csv('科目満足度アンケート.csv', index_col=0)
        new_df = df.fillna(0)
        return new_df

    #選択した学籍番号の科目満足度アンケートの内容を取得する
def searcing_satisfy(selected_academic_number, satisfaction_file):
        satisfy_academic_numbers = []
        satisfy_academic_numbers = satisfaction_file['学籍番号を入力お願いします']
        satisfaction_file_i = satisfaction_file.set_index('学籍番号を入力お願いします')

        for satisfy_academic_number in satisfy_academic_numbers:
            if selected_academic_number == str(satisfy_academic_number):
                return satisfaction_file_i.loc[satisfy_academic_number]
        return "0"

def measure_personaDistance(User_persona_data, selected_persona_data):
        return dist(User_persona_data, selected_persona_data)

def get_persona_data(df, academic_num):
        df_i = df.set_index('学籍番号')
        df_i = df_i.loc[academic_num]
        return df_i.fillna(0)

def main():
        csv_download()
        academic_number, df , df_str, User_academic_number = encoding()
        User_cluster = 0
        User_persona_data = 0

        subject = ["物理学の基礎", "情報科学基礎", "情報メディア実習", "数学の基礎1", "数学の基礎2",
        "生産活動と情報", "連続表現", "シミュレーション基礎演習", "線形代数学1", "情報と社会",
        "電気の基礎", "応用数理解析", "情報数学の基礎", "プログラミングJava3", "情報キャリアデザイン"]

        satisfy_question = ["難易度", "知識習得_情報工学", "知識習得_プログラミング", "知識習得_英語",
        "社会への学び", "人間への学び", "グループワークの多さ", "成績の付け方", "満足度"]
        datas = pca(df)
        class_num = find_clusterNum_silhouette(datas)
        cluster_nums = k_means(datas, class_num)


        personaData_with_cluster = [[0,0,0]]*len(academic_number)
        satisfy_data_str = []
        satisfy_datas_inCluster = []
        academic_number_inCluster = []
        personaData_inCluster = []
        personaDistance = []
        #配属されたクラスタの数、学籍番号、ペルソナデータをpersonaData_with_clusterに入れていく
        for i in range(len(academic_number)):
            personaData_with_cluster[i] = [cluster_nums[i], academic_number[i], datas[i]]
        #科目満足度ファイルのデータをsatisfaction_fileに入れる
        satisfaction_file = open_satisfaction_file()

    #ユーザのクラスタを探し、for文で同じクラスタに属している学籍番号を取り出す
        for personaData in personaData_with_cluster:
            if personaData[1] == User_academic_number:
                User_cluster = personaData[0]
                User_persona_data = personaData[2]
                break
    #同じクラスタに属している科目満足度データを取り出し、距離を測る
        for personaData in personaData_with_cluster:
            if personaData[0] == User_cluster:
                if personaData[1] != User_academic_number:
                    satisfy_data_str = searcing_satisfy(personaData[1], satisfaction_file)
                    if len(satisfy_data_str) != 1:
                        satisfy_datas_inCluster.append(satisfy_data_str)
                        academic_number_inCluster.append(personaData[1])
                        personaData_inCluster.append(personaData[2])
                        personaDistance.append(measure_personaDistance(User_persona_data, personaData[2]))
    #同クラスタ内のペルソナ距離で近いものから３つ取り出す
        result_data = []
        result_persona = []
        result_academic_number = []
        element_num = 0
        
        for i in range(3):
            element_num = personaDistance.index(min(personaDistance))
            result_data.append(np.array_split(satisfy_datas_inCluster[element_num],15))
            result_academic_number.append(academic_number_inCluster[element_num])
            result_persona.append(get_persona_data(df_str,academic_number_inCluster[element_num]))
            del personaDistance[element_num]
            del satisfy_datas_inCluster[element_num]
            del academic_number_inCluster[element_num]
            del personaData_inCluster[element_num]

        
    #整えたデータをjson形式にする
        ys = []
        for i in range(len(result_academic_number)):
            data = cl.OrderedDict()
            data["学年"] = result_persona[i][0]
            data["性別"] = result_persona[i][1]
            for j in range(len(subject)):
                if int(result_data[i][j][0]) != 0: 
                    data_str = cl.OrderedDict()
                    for k in range(len(satisfy_question)):
                        data_str[satisfy_question[k]] = str(result_data[i][j][k]) 
                    data[subject[j]] = data_str
                
    
            ys.append(data)
        with open('satisfy.json', 'w') as f:
            json.dump(ys, f, ensure_ascii=False)
        return ys


if __name__ == "__main__":
    data = main()
    print(data)
    


#ユーザがアンケートを入力したとき、既存のデータと組み合わせて、One_Hot_Encode
#ユーザの学籍番号は控えておく

# we also need age?
# "https://www.nal.usda.gov/human-nutrition-and-food-safety/dri-calculator"
# Sample for: Male, 25 years, 5'8, 160 pounds, Active
RECOMMENDED_DAILY_NUTIOTION = {
    "calories": 2500, # kcal
    "carbs": 400, # grams
    "fat": 80, # grams
    "protein": 58 # grams
}



# firebase cred
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
cred = credentials.Certificate("health-advisor-d978b-firebase-adminsdk-5c4ew-27c5ad9361.json")
firebase_admin.initialize_app(cred)
db = firestore.client() # connecting to firestore

collection = db.collection('dailyFoods')  # create collection
res = collection.document('BbRiqfceBRRFj8afg3Ty').get().to_dict()


collection_user = db.collection('userInfo')  # we also need age?
res_user = collection_user.document('UAGA3rW2OFZOOd6T7i1O').get().to_dict() # we also need age?
meal_count = res_user['targetMealsPerDay']


# daily remaining calc
fat_sum, calories_sum, carbs_sum, protein_sum = 0, 0, 0, 0
for food in res['foodAte']:
    fat_sum += food['fat']
    calories_sum += food['calories']
    carbs_sum += food['carbs']
    protein_sum += food['protein']

print(fat_sum, calories_sum, carbs_sum, protein_sum)

fat_remain = RECOMMENDED_DAILY_NUTIOTION["fat"] - fat_sum if \
    0.2 < (RECOMMENDED_DAILY_NUTIOTION["fat"] - fat_sum) / RECOMMENDED_DAILY_NUTIOTION["fat"] else 0
calories_remain = RECOMMENDED_DAILY_NUTIOTION["calories"] - calories_sum if \
    0.2 < (RECOMMENDED_DAILY_NUTIOTION["calories"] - calories_sum) / RECOMMENDED_DAILY_NUTIOTION["calories"] else 0
carbs_remain = RECOMMENDED_DAILY_NUTIOTION["carbs"] - carbs_sum if \
    0.2 < (RECOMMENDED_DAILY_NUTIOTION["carbs"] - carbs_sum) / RECOMMENDED_DAILY_NUTIOTION["carbs"] else 0
protein_remain = RECOMMENDED_DAILY_NUTIOTION["protein"] - protein_sum if \
    0.2 < (RECOMMENDED_DAILY_NUTIOTION["protein"] - protein_sum) / RECOMMENDED_DAILY_NUTIOTION["protein"] else 0

suggestion = []
if fat_remain:
    suggestion.append(str(fat_remain) + " grams of fat ")
if calories_remain:
    suggestion.append(str(calories_remain) + " kcal of calories ")
if carbs_remain:
    suggestion.append(str(carbs_remain) + " grams of carbs ")
if protein_remain:
    suggestion.append(str(protein_remain) + " grams of protein ")

ask_chatGPT = "give me food recipe that contains " + "".join(suggestion) + \
    " ,you need to suggest " + str(meal_count) + \
        " meals that meet the dietary requirements and preferences while prioritizing health and well-being"
print(ask_chatGPT)


# chatGPT API
import openai
openai.api_key = "YOUR_API_KEY"
model_engine = "gpt-3.5-turbo"

response = openai.ChatCompletion.create(
    model='gpt-3.5-turbo',
    messages=[
        {"role": "user", "content": ask_chatGPT},
    ])

message = response.choices[0]['message']



# output
print("{}: {}".format(message['role'], message['content']))
from selenium import webdriver
driver = webdriver.Chrome('./chromedriver')
driver.implicitly_wait(3)
driver.get(
    'https://news.naver.com/main/read.nhn?mode=LSD&mid=shm&sid1=102&oid=001&aid=0011761606')

#Xpath 
#//*[@id="news_title_text_id"]

#selenium 명령어로 driver에 넣어줌.
title = driver.find_element_by_xpath('//*[@id="articleTitle"]') # xpath의 내용을 찾아내서 html의 dom을 title에 넣는다.
body = driver.find_element_by_xpath('//*[@id="articleBodyContents"]')

print(title.text)
print(body.text)




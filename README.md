# 환경변수
- .env 파일에 어떤 환경변수가 추가되어야 하는지 작성합니다.
- key=value 형태에서 key만 나열합니다. value는 비밀!

- DB_URL
- JWT_SECRET
- 그 밖의 사용한 환경변수를 나열해 주세요.

# API 명세서 URL
- https://www.notion.so/nongsi/API-11b02b0921be4b36a9e12e37fb91db55?pvs=4

# ERD URL
- https://www.erdcloud.com/d/xiCC4HRjDiwPiyWJp

# 더 고민해 보기
1. **암호화 방식**
 ✅ 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?

 : 해시(Hash)는 단방향 암호화 방식에 해당합니다.

 ✅ 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?

: 비밀번호를 해시한 값을 저장하면 원본 비밀번호를 알 수 없으므로, 해시를 사용하면 사용자의 비밀번호를 안전하게 보호할 수 있습니다. 
해시된 비밀번호는 원본 비밀번호를 노출시키지 않으며, 무단으로 비밀번호를 역추적할 수 없어 보안성이 향상됩니다.

3. **인증 방식**
✅ JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?

   ➡️ 탈취: 악의적인 공격자가 Access Token을 탈취하여 해당 사용자로서의 권한을 획득할 수 있습니다.

   ➡️ 재생: Access Token이 유출되면 공격자가 해당 토큰을 사용하여 무차별적으로 서비스에 접근할 수 있습니다.

✅ 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?

 ➡️ 짧은 유효기간: Access Token의 유효기간을 짧게 설정하여 탈취 시간을 최소화합니다.
   
 ➡️ Refresh Token: Access Token을 발급할 때 함께 발급되는 Refresh Token을 사용하여 Access Token이 만료되었을 때 새로운 Access Token을 발급합니다.

5. **인증과 인가**
✅ 인증과 인가가 무엇인지 각각 설명해 주세요.

 ➡️ 인증 : 사용자가 자신을 확인하는 과정으로, 사용자가 제공한 정보(예: 아이디, 비밀번호)를 검증하여 사용자의 신원을 확인합니다.

 ➡️ 인가 : 인증된 사용자가 특정 리소스에 대한 접근 권한을 부여받는 것으로, 인증된 사용자가 특정 리소스에 접근할 수 있는지 여부를 결정합니다.
    
✅ 과제에서 구현한 Middleware는 인증에 해당하나요? 인가에 해당하나요? 그 이유도 알려주세요.
   
: 인증(Authentication)에 해당합니다. 인증된 사용자의 요청을 검사하고 사용자의 신원을 확인하여 요청을 처리하기 때문입니다.

6. **Http Status Code**
   ✅ 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.

   200 OK: 요청이 성공적으로 처리되었음을 나타냄.

   201 Created : 요청이 성공적으로 처리되고 새로운 리소스가 생성됨을 나타냄.
	
   400 Bad Request: 잘못된 요청으로 인해 서버가 요청을 이해하지 못했음을 나타냄.
	
   401 Unauthorized: 인증이 필요한 리소스에 대한 접근 시도가 실패했음을 나타냄.
	
   404 Not Found: 요청한 리소스를 찾을 수 없음을 나타냄.
	
   500 Internal Server Error : 서버에 오류가 발생함을 나타냄.

7. **리팩토링**
    ✅ MySQL, Prisma로 개발했는데 MySQL을 MongoDB로 혹은 Prisma 를 TypeORM 로 변경하게 된다면 많은 코드 변경이 필요할까요? 주로 어떤 코드에서 변경이 필요한가요?

      ➡️ MySQL을 MongoDB로 변경하거나 Prisma를 TypeORM으로 변경하는 경우 많은 코드 변경이 필요할 수 있습니다.

       이는 두 데이터베이스 간의 구조 및 ORM(Object-Relational Mapping) 도구 간의 차이 때문입니다.
	
       0️⃣ 모델 정의 및 쿼리 작성: MySQL과 MongoDB는 데이터 모델링 및 쿼리 작성 방법이 다르기 때문에 해당 부분의 코드를 변경해야 할 수 있습니다.

       1️⃣ 데이터베이스 연결 설정: MySQL과 MongoDB는 서로 다른 데이터베이스 엔진을 사용하므로 연결 설정 부분의 코드도 변경이 필요할 수 있습니다.
	
       2️⃣ 쿼리 실행 및 결과 처리: ORM 도구인 Prisma와 TypeORM은 각각 다른 방식으로 쿼리를 실행하고 결과를 처리하기 때문에 해당 부분의 코드도 변경이 필요할 수 있습니다.
      
    ✅ 만약 이렇게 DB를 변경하는 경우가 또 발생했을 때, 코드 변경을 보다 쉽게 하려면 어떻게 코드를 작성하면 좋을 지 생각나는 방식이 있나요? 있다면 작성해 주세요.

      ORM 기능 활용하여 코드를 작성하면 됩니다. 데이터베이스의 구체적인 종류에 대한 의존성을 낮출 수 있습니다. 대신 ORM의 기능을 최대한 활용하여 데이터베이스와의 추상화를 높이는 것이 중요합니다.
      ORM을 사용하면 데이터베이스의 종류에 따라서 쿼리를 작성하는 방식이나 결과를 처리하는 방식을 ORM이 알아서 처리해주기 때문에, 코드 변경을 보다 쉽게 할 수 있습니다.


9. **API 명세서**
    ✅ notion 혹은 엑셀에 작성하여 전달하는 것 보다 swagger 를 통해 전달하면 장점은 무엇일까요?
	
 	➡️ Swagger를 통해 API 명세서를 전달하는 장점

	0️⃣ 자동화된 문서 생성: Swagger를 사용하면 API 명세서를 자동으로 생성할 수 있습니다.
	
 	1️⃣ 상호작용 가능한 API 문서: Swagger UI를 통해 API 명세서를 시각화하고 테스트할 수 있습니다.
	
 	2️⃣ 표준화된 API 문서 형식: Swagger는 표준화된 API 문서 형식을 제공하여 개발자 간 협업을 용이하게 합니다.

self.addEventListener("install", function (event) {
    console.log("✅ [서비스워커] 설치됨");
  });
 
  self.addEventListener("activate", function (event) {
    console.log("✅ [서비스워커] 활성화됨");
  });
 
  self.addEventListener("fetch", function (event) {
    // 오프라인 캐시 기능 추가 가능
  });
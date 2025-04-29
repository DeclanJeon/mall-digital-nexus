graph TD
    A[시작: Peermall] --> B(홈: /);
    B --> C(쇼핑: /shopping);
    B --> D(큐레이션 링크: /curation-links);
    B --> E(커뮤니티: /community);
    B --> F(오픈 채팅: /openchat);
    B --> G(로그인: /login);
    B --> H(서비스 소개: /service);
    B --> I(내 정보: /my-info);
    B --> Z(404: *);

    subgraph "홈 (/) 구성 요소"
        B --> B_Header[헤더]
        B --> B_CatNav[카테고리 네비게이션]
        B --> B_ServiceCards[서비스 카드 섹션]
        B --> B_FavServices[즐겨찾는 서비스]
        B --> B_Map[피어맵 (통합 예정)]
        B --> B_Footer[푸터]
    end

    subgraph "쇼핑 (/shopping) 구성 요소"
        C --> C_Header[헤더]
        C --> C_CatNav[카테고리 네비게이션]
        C --> C_Filter[쇼핑 필터]
        C --> C_Grid[상품 그리드]
        C --> C_Footer[푸터]
    end
    
    subgraph "커뮤니티 (/community) 구성 요소"
        E --> E_Header[헤더]
        E --> E_CatNav[카테고리 네비게이션]
        E --> E_Tabs[탭 (그룹채팅/게시판)]
        E_Tabs --> E_GroupChat[그룹 채팅 인터페이스]
        E_Tabs --> E_Forum[게시판 목록]
        E_Forum --> E_PostDetail(게시글 상세: /community/post/:postId)
        E --> E_Footer[푸터]
    end

     subgraph "서비스 소개 (/service) 구성 요소"
        H --> H_Header[헤더]
        H --> H_CatNav[카테고리 네비게이션]
        H --> H_Content[서비스 설명 콘텐츠]
        H --> H_Footer[푸터]
    end

    subgraph "내 정보 (/my-info) 구성 요소"
        I --> I_Header[헤더]
        I --> I_CatNav[카테고리 네비게이션]
        I --> I_Profile[프로필 관리 카드]
        I --> I_Peermall[피어몰 관리 카드]
        I --> I_Posts[게시글 관리 카드]
        I --> I_MapReg[지도 등록 버튼]
        I --> I_Referral[추천인 관리 카드]
        I --> I_Sponsor[스폰서/에이전트 관리 카드]
        I --> I_Ad[광고 신청 카드]
        I --> I_Footer[푸터]
    end
    
    subgraph "로그인 (/login) 구성 요소"
        G --> G_Header[헤더]
        G --> G_CatNav[카테고리 네비게이션]
        G --> G_Form[로그인 폼]
        G --> G_Footer[푸터]
    end

    style B fill:#d4eaf7,stroke:#3b3c3d,stroke-width:2px
    style E fill:#b6ccd8,stroke:#3b3c3d,stroke-width:1px
    style I fill:#b6ccd8,stroke:#3b3c3d,stroke-width:1px
    style G fill:#f5f4f1,stroke:#cccbc8,stroke-width:1px
    style Z fill:#cccbc8,stroke:#3b3c3d,stroke-width:1px
```

**사이트맵 다이어그램 설명 (업데이트):**

*   이 다이어그램은 현재 프로젝트의 주요 페이지 간의 기본적인 네비게이션 구조를 보여줍니다.
*   `시작: Peermall` 노드는 웹사이트의 진입점을 나타냅니다.
*   각 박스는 주요 페이지를 나타내며, 해당 페이지의 경로가 함께 표시됩니다.
*   각 주요 페이지 노드 아래에 해당 페이지를 구성하는 주요 컴포넌트 또는 기능 영역을 나타내는 하위 노드들이 연결되어 있습니다.
*   동적으로 생성되는 상세 페이지(예: 게시글 상세)는 예시 경로로 표시되었습니다.
*   색상 및 스타일은 디자인 시스템 가이드라인을 일부 반영하여 시각적 구분을 돕습니다.

이 Mermaid 코드를 지원하는 뷰어(예: VS Code 확장 프로그램, 온라인 뷰어)에서 보면 시각적인 다이어그램으로 확인할 수 있습니다.

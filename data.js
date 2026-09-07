/**
 * EXAMORA — Premium Assessment Platform Data Store
 * Contains authentic examinations, full question banks, leaderboard records,
 * student profiles, and historical performance metrics.
 */

const EXAMORA_DATA = {
  // Current logged in mock users
  users: {
    student: {
      id: "usr_alex_01",
      role: "student",
      name: "Alex Morgan",
      email: "alex.morgan@stanford.edu",
      avatar: "AM",
      avatarColor: "linear-gradient(135deg, #6366F1, #8B5CF6)",
      title: "Senior Computer Science Fellow",
      institution: "Stanford University",
      joined: "Jan 2025",
      overallScore: 94,
      examsCompleted: 24,
      passRate: 96,
      studyProgress: 18,
      streakDays: 14,
      globalRank: 3,
      rankPoints: 14250,
      recentResults: [
        {
          examId: "cs-301",
          title: "Advanced Computer Science & System Design",
          score: 94,
          marks: "28/30",
          status: "Passed",
          date: "Yesterday",
          timeSpent: "24m 18s"
        },
        {
          examId: "web-204",
          title: "Full-Stack Web Architecture & Cloud Systems",
          score: 92,
          marks: "23/25",
          status: "Passed",
          date: "3 days ago",
          timeSpent: "31m 04s"
        },
        {
          examId: "ai-401",
          title: "AI & Deep Learning Foundations",
          score: 88,
          marks: "18/20",
          status: "Passed",
          date: "1 week ago",
          timeSpent: "26m 40s"
        }
      ],
      subjectMastery: [
        { subject: "Computer Science", percentage: 96, color: "#6366F1" },
        { subject: "Cloud & Distributed Systems", percentage: 91, color: "#06B6D4" },
        { subject: "Data Structures & Algorithms", percentage: 94, color: "#8B5CF6" },
        { subject: "Cyber Security & Networks", percentage: 89, color: "#10B981" },
        { subject: "AI & Machine Learning", percentage: 85, color: "#F59E0B" }
      ]
    },
    admin: {
      id: "usr_admin_01",
      role: "admin",
      name: "Dr. Evelyn Vance",
      email: "evelyn.vance@examora.io",
      avatar: "EV",
      avatarColor: "linear-gradient(135deg, #06B6D4, #3B82F6)",
      title: "Chief Academic Officer",
      institution: "EXAMORA Consortium",
      joined: "Oct 2024"
    }
  },

  // Available Exams Catalog
  exams: [
    {
      id: "cs-301",
      title: "Advanced Computer Science & System Design",
      slug: "advanced-computer-science",
      category: "Computer Science",
      difficulty: "Hard",
      badgeClass: "badge-hard",
      durationMins: 45,
      questionsCount: 30,
      totalMarks: 30,
      passPercentage: 70,
      rating: 4.9,
      attempts: 8420,
      featured: true,
      description: "Master distributed systems, algorithmic complexity, memory management, concurrency models, and enterprise system design principles.",
      tags: ["Distributed Systems", "Concurrency", "Algorithms", "Databases"],
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
    },
    {
      id: "web-204",
      title: "Full-Stack Web Architecture & Cloud Systems",
      slug: "fullstack-cloud-architecture",
      category: "Cloud Architecture",
      difficulty: "Intermediate",
      badgeClass: "badge-intermediate",
      durationMins: 35,
      questionsCount: 25,
      totalMarks: 25,
      passPercentage: 68,
      rating: 4.8,
      attempts: 6150,
      featured: true,
      description: "Evaluate microservices patterns, WebSocket protocols, serverless runtimes, state hydration, and Kubernetes pod orchestration.",
      tags: ["Microservices", "REST/GraphQL", "Docker", "AWS"],
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`
    },
    {
      id: "ai-401",
      title: "Artificial Intelligence & Neural Architectures",
      slug: "ai-machine-learning",
      category: "AI & ML",
      difficulty: "Advanced",
      badgeClass: "badge-hard",
      durationMins: 40,
      questionsCount: 20,
      totalMarks: 20,
      passPercentage: 75,
      rating: 4.95,
      attempts: 4930,
      featured: true,
      description: "Comprehensive evaluation of Transformer models, multi-head attention, loss gradient backprop, reinforcement learning, and vector embeddings.",
      tags: ["Transformers", "Attention", "PyTorch", "Embeddings"],
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4 4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z"/><circle cx="12" cy="18" r="4"/><path d="M12 11v3"/><path d="M8 18h8"/></svg>`
    },
    {
      id: "sec-305",
      title: "Cyber Security & Defensive Cryptography",
      slug: "cyber-security-cryptography",
      category: "Cyber Security",
      difficulty: "Hard",
      badgeClass: "badge-hard",
      durationMins: 40,
      questionsCount: 25,
      totalMarks: 25,
      passPercentage: 72,
      rating: 4.85,
      attempts: 3820,
      featured: false,
      description: "Assess zero-trust architecture, TLS 1.3 handshake mechanics, elliptic-curve cryptography, CSRF/XSS vectors, and SIEM incident triage.",
      tags: ["Zero Trust", "Elliptic Curve", "Pen-testing", "Auth0"],
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
    },
    {
      id: "dsa-108",
      title: "Data Structures & Algorithmic Complexity",
      slug: "data-structures-algorithms",
      category: "Data Structures",
      difficulty: "Intermediate",
      badgeClass: "badge-intermediate",
      durationMins: 50,
      questionsCount: 30,
      totalMarks: 30,
      passPercentage: 65,
      rating: 4.9,
      attempts: 12100,
      featured: false,
      description: "Deep dive into red-black trees, AVL balancing, amortized time analysis, dynamic programming memoization, and topological graph sorting.",
      tags: ["Dynamic Programming", "Graph Theory", "Trees", "Big-O"],
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`
    },
    {
      id: "dev-202",
      title: "Modern DevOps & Site Reliability Engineering",
      slug: "devops-sre-engineering",
      category: "DevOps",
      difficulty: "Intermediate",
      badgeClass: "badge-intermediate",
      durationMins: 30,
      questionsCount: 20,
      totalMarks: 20,
      passPercentage: 70,
      rating: 4.75,
      attempts: 4200,
      featured: false,
      description: "Validate CI/CD pipelines, GitOps with ArgoCD, Prometheus/Grafana metric alerts, chaos engineering drills, and immutable infrastructure with Terraform.",
      tags: ["Terraform", "Kubernetes", "Prometheus", "CI/CD"],
      icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
    }
  ],

  // Flagship 30-question bank for "cs-301: Advanced Computer Science & System Design"
  questionBank: [
    {
      id: 1,
      question: "Which fundamental data structure operates strictly on the First-In, First-Out (FIFO) principle?",
      codeSnippet: null,
      options: [
        "Stack",
        "Queue",
        "Binary Search Tree",
        "Directed Acyclic Graph"
      ],
      correct: 1,
      explanation: "A Queue operates on the First-In, First-Out (FIFO) principle where elements are enqueued at the rear and dequeued from the front. Conversely, a Stack operates on LIFO.",
      category: "Computer Science",
      difficulty: "Easy",
      marks: 1
    },
    {
      id: 2,
      question: "In asynchronous multi-threaded system programming, what critical property prevents two threads from executing a critical section simultaneously?",
      codeSnippet: "mutex.lock();\n// Critical Section\nshared_counter++;\nmutex.unlock();",
      options: [
        "Mutual Exclusion",
        "Starvation Freedom",
        "Spurious Wakeup",
        "Cache Coherency"
      ],
      correct: 0,
      explanation: "Mutual exclusion is the concurrency property that guarantees that no two concurrent processes or threads will enter their critical section at the exact same instant.",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    },
    {
      id: 3,
      question: "What is the worst-case time complexity of searching for an element in an unbalanced Binary Search Tree (BST)?",
      codeSnippet: null,
      options: [
        "O(1)",
        "O(log N)",
        "O(N)",
        "O(N log N)"
      ],
      correct: 2,
      explanation: "In an unbalanced BST (e.g. when values are inserted in sorted order), the tree degenerates into a singly linked list where searching requires traversing all N nodes, resulting in O(N).",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    },
    {
      id: 4,
      question: "According to Eric Brewer's CAP theorem in distributed computing, which two guarantees can a system provide simultaneously during an unavoidable network partition (P)?",
      codeSnippet: null,
      options: [
        "Consistency and Availability",
        "Either Consistency or Availability, but never both",
        "Performance and Durability",
        "Atomicity and Isolation"
      ],
      correct: 1,
      explanation: "When a network partition (P) occurs in a distributed system, the system MUST choose between Consistency (C) — where every read receives the most recent write or errors — or Availability (A) — where every non-failing node returns a response.",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    },
    {
      id: 5,
      question: "In relational database ACID properties, which guarantee ensures that transactions that have committed will survive system crashes and power failures?",
      codeSnippet: "BEGIN TRANSACTION;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;",
      options: [
        "Atomicity",
        "Consistency",
        "Isolation",
        "Durability"
      ],
      correct: 3,
      explanation: "Durability guarantees that once a transaction has been committed, it will remain committed even in the event of a system crash, power loss, or OS restart (usually achieved via write-ahead logging).",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    },
    {
      id: 6,
      question: "Which sorting algorithm possesses an asymptotic average time complexity of O(N log N) while maintaining guaranteed worst-case O(N log N) performance without relying on auxiliary O(N) memory?",
      codeSnippet: null,
      options: [
        "Quick Sort",
        "Merge Sort",
        "Heap Sort",
        "Bubble Sort"
      ],
      correct: 2,
      explanation: "Heap Sort provides O(N log N) worst-case time complexity and sorts in-place using O(1) auxiliary memory. Merge Sort requires O(N) auxiliary space, while Quick Sort degrades to O(N²) worst-case.",
      category: "Computer Science",
      difficulty: "Hard",
      marks: 1
    },
    {
      id: 7,
      question: "In modern operating systems, which memory management hardware unit translates virtual page addresses generated by CPU instructions into physical RAM addresses?",
      codeSnippet: null,
      options: [
        "Translation Lookaside Buffer (TLB) / MMU",
        "Direct Memory Access (DMA) Controller",
        "Arithmetic Logic Unit (ALU)",
        "Instruction Pipeline Decoder"
      ],
      correct: 0,
      explanation: "The Memory Management Unit (MMU), assisted by the Translation Lookaside Buffer (TLB) hardware cache, performs the virtual-to-physical address translation via page tables.",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    },
    {
      id: 8,
      question: "What is the primary architectural purpose of utilizing a Write-Ahead Log (WAL) in distributed storage engines like PostgreSQL and Apache Cassandra?",
      codeSnippet: null,
      options: [
        "To compress data on disk before cold storage archival",
        "To guarantee crash-recovery durability before persisting changes to main data files",
        "To encrypt user queries before transmission over the public network",
        "To automatically generate OpenAPI REST documentation"
      ],
      correct: 1,
      explanation: "A Write-Ahead Log records state changes sequentially to append-only disk storage before applying them to database files, ensuring immediate crash recovery without waiting for random disk writes.",
      category: "Computer Science",
      difficulty: "Hard",
      marks: 1
    },
    {
      id: 9,
      question: "Which of the following describes the 'Liskov Substitution Principle' (LSP) in SOLID object-oriented software architecture?",
      codeSnippet: null,
      options: [
        "Functions should be open for extension but closed for modification",
        "Subtypes must be substitutable for their base types without altering the correctness of the program",
        "Clients should not be forced to depend on interfaces they do not use",
        "High-level modules should not depend on low-level modules; both should depend on abstractions"
      ],
      correct: 1,
      explanation: "The Liskov Substitution Principle states that if S is a subtype of T, objects of type T may be replaced with objects of type S without altering any desirable properties of the program.",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    },
    {
      id: 10,
      question: "In TCP network communications, what is the sequence of flag packets exchanged during the initial three-way handshake?",
      codeSnippet: "Client ────────[ ? ]────────> Server\nClient <───────[ ? ]──────── Server\nClient ────────[ ? ]────────> Server",
      options: [
        "SYN → SYN-ACK → ACK",
        "ACK → SYN → ACK-SYN",
        "FIN → SYN → RST",
        "PING → PONG → CONNECT"
      ],
      correct: 0,
      explanation: "The TCP three-way handshake starts with the client transmitting a SYN packet, the server responding with a SYN-ACK, and the client acknowledging with an ACK packet.",
      category: "Computer Science",
      difficulty: "Easy",
      marks: 1
    },
    {
      id: 11,
      question: "Which cache invalidation strategy writes data synchronously to both the cache and the primary persistent storage layer simultaneously?",
      codeSnippet: null,
      options: [
        "Write-Through Cache",
        "Write-Back (Write-Behind) Cache",
        "Write-Around Cache",
        "Read-Through Cache"
      ],
      correct: 0,
      explanation: "Write-Through caching writes data to both cache and storage simultaneously, ensuring strict data consistency at the expense of higher write latency.",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    },
    {
      id: 12,
      question: "In distributed consensus algorithms like Raft and Paxos, what fundamental problem is primarily being solved across unreliable network nodes?",
      codeSnippet: null,
      options: [
        "Byzantine Fault Tolerance against cryptographic tampering",
        "Reaching agreement on a single data state or log sequence despite node crashes",
        "Maximizing GPU tensor core utilization during model inference",
        "Minimizing browser CSS reflow times"
      ],
      correct: 1,
      explanation: "Consensus protocols such as Raft and Paxos solve the problem of getting a cluster of distributed nodes to agree on state transitions, even when some nodes fail or network messages are delayed.",
      category: "Computer Science",
      difficulty: "Hard",
      marks: 1
    },
    {
      id: 13,
      question: "Which hashing technique maps both cache servers and stored data keys onto a shared circular mathematical keyspace to minimize key migration during node scaling?",
      codeSnippet: null,
      options: [
        "Consistent Hashing",
        "Cryptographic SHA-512 Hashing",
        "Cuckoo Hashing",
        "Murmur3 Non-Cryptographic Hashing"
      ],
      correct: 0,
      explanation: "Consistent Hashing maps both servers and data keys onto a virtual ring. When a server is added or removed, on average only K/N keys need to be remapped, making it essential for CDNs and distributed caches.",
      category: "Computer Science",
      difficulty: "Hard",
      marks: 1
    },
    {
      id: 14,
      question: "What is the primary distinction between a Process and a Thread in modern Unix/Linux architectures?",
      codeSnippet: null,
      options: [
        "Processes share virtual memory; threads have isolated address spaces",
        "Processes have their own virtual address space; threads within a process share the address space and open file descriptors",
        "Threads cannot be scheduled on multi-core processors",
        "Processes run strictly in kernel mode; threads run in user mode"
      ],
      correct: 1,
      explanation: "Processes possess separate, isolated virtual address spaces managed by the OS. Threads exist inside a process and share its heap, address space, and system handles while retaining their own stack and registers.",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    },
    {
      id: 15,
      question: "Which indexing data structure is most commonly utilized in relational databases (such as MySQL InnoDB) for primary keys and range-based queries?",
      codeSnippet: null,
      options: [
        "B+ Tree",
        "Skip List",
        "Radix Trie",
        "Bloom Filter"
      ],
      correct: 0,
      explanation: "B+ Trees store all actual record pointers/values in leaf nodes, linked sequentially. This design facilitates efficient block I/O and rapid range scans (e.g. BETWEEN or >= queries).",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    },
    {
      id: 16,
      question: "What probabilistic data structure is used to rapidly test whether an element is definitely NOT in a set with zero false negatives?",
      codeSnippet: null,
      options: [
        "Bloom Filter",
        "Red-Black Tree",
        "Hash Map",
        "HyperLogLog"
      ],
      correct: 0,
      explanation: "A Bloom Filter is a space-efficient probabilistic data structure that can tell you with 100% certainty if an element is NOT in a set (no false negatives), though it may yield occasional false positives.",
      category: "Computer Science",
      difficulty: "Hard",
      marks: 1
    },
    {
      id: 17,
      question: "In HTTP/2 and HTTP/3 specifications, which major performance limitation of HTTP/1.1 pipelining was eliminated through binary frame multiplexing?",
      codeSnippet: null,
      options: [
        "Head-of-Line (HoL) Blocking at the application layer",
        "DNS resolution latency",
        "SSL/TLS handshake requirement",
        "Cookie header size limitation"
      ],
      correct: 0,
      explanation: "HTTP/2 multiplexes multiple bidirectional request/response streams over a single TCP connection, eliminating application-level Head-of-Line blocking where one slow response delayed subsequent requests.",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    },
    {
      id: 18,
      question: "Which architectural design pattern decouples producers of events from consumers via an asynchronous intermediary broker?",
      codeSnippet: "Producer -> [ Topic / Broker ] -> Consumer A\n                             -> Consumer B",
      options: [
        "Publish-Subscribe (Pub/Sub) Pattern",
        "Singleton Pattern",
        "Proxy Pattern",
        "Flyweight Pattern"
      ],
      correct: 0,
      explanation: "The Publish-Subscribe (Pub/Sub) pattern allows publishers to push messages to topics without knowing who will receive them. Subscribers listen to specific topics independently.",
      category: "Computer Science",
      difficulty: "Easy",
      marks: 1
    },
    {
      id: 19,
      question: "What deadlock prevention technique enforces a strict global total ordering on all resources before a thread can acquire locks?",
      codeSnippet: null,
      options: [
        "Resource Hierarchy (Lock Ordering)",
        "Exponential Backoff",
        "Banker's Algorithm with speculative thread abortion",
        "Double-Checked Locking"
      ],
      correct: 0,
      explanation: "By assigning numeric IDs to all shared locks and requiring all threads to acquire locks in ascending numerical order, circular wait conditions cannot form, mathematically preventing deadlocks.",
      category: "Computer Science",
      difficulty: "Hard",
      marks: 1
    },
    {
      id: 20,
      question: "Which algorithm is utilized to find the shortest paths between nodes in a weighted graph with strictly non-negative edge weights?",
      codeSnippet: null,
      options: [
        "Dijkstra's Algorithm",
        "Bellman-Ford Algorithm",
        "Floyd-Warshall with negative cycle detection",
        "Kruskal's Minimum Spanning Tree Algorithm"
      ],
      correct: 0,
      explanation: "Dijkstra's Algorithm finds the shortest path from a source node to all other nodes in a graph with non-negative edge weights in O((V + E) log V) using a priority queue.",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    },
    {
      id: 21,
      question: "In database concurrency control, which isolation level completely prevents Dirty Reads, Non-Repeatable Reads, and Phantom Reads?",
      codeSnippet: null,
      options: [
        "Serializable",
        "Repeatable Read",
        "Read Committed",
        "Read Uncommitted"
      ],
      correct: 0,
      explanation: "Serializable is the highest isolation level defined in SQL-92. It guarantees execution equivalent to serial (one-by-one) transaction processing, eliminating dirty, non-repeatable, and phantom reads.",
      category: "Computer Science",
      difficulty: "Hard",
      marks: 1
    },
    {
      id: 22,
      question: "What is the primary role of an Epoll (Linux) or Kqueue (BSD/macOS) system call compared to traditional select() and poll()?",
      codeSnippet: null,
      options: [
        "O(1) event-driven I/O multiplexing that monitors file descriptors without scanning the entire descriptor list",
        "Enforcing symmetric hardware encryption on loopback sockets",
        "Overriding CPU branch prediction tables in userspace",
        "Compressing network packets inside the network interface card"
      ],
      correct: 0,
      explanation: "Epoll scales in O(1) time per event because the kernel notifies the application only of ready descriptors, unlike select/poll which scan through all O(N) monitored file descriptors on every tick.",
      category: "Computer Science",
      difficulty: "Hard",
      marks: 1
    },
    {
      id: 23,
      question: "In cloud architectures, what is a Circuit Breaker pattern primarily designed to prevent?",
      codeSnippet: null,
      options: [
        "Cascading service failures when an upstream dependency experiences latency or downtime",
        "Unauthorized SQL injection attacks against database clusters",
        "Overfilling hard drives during log rotation",
        "Cross-origin resource sharing (CORS) preflight errors"
      ],
      correct: 0,
      explanation: "A Circuit Breaker monitors for failures. If error thresholds are exceeded, the breaker trips to 'Open', immediately failing fast or returning fallback responses to protect callers and downstream systems.",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    },
    {
      id: 24,
      question: "What is the asymptotic space complexity of an in-place Quick Sort implementation using Lomuto or Hoare partitioning?",
      codeSnippet: null,
      options: [
        "O(log N) due to recursive call stack frames",
        "O(1) strictly",
        "O(N) auxiliary array space",
        "O(N²)"
      ],
      correct: 0,
      explanation: "While in-place Quick Sort does not allocate additional data arrays, its recursive call stack requires O(log N) auxiliary space on average (and O(N) in worst-case degenerate recursion).",
      category: "Computer Science",
      difficulty: "Hard",
      marks: 1
    },
    {
      id: 25,
      question: "Which of the following hashing algorithms is intentionally designed with configurable work factors (iteration counts) to resist GPU brute-force attacks on passwords?",
      codeSnippet: null,
      options: [
        "bcrypt / Argon2",
        "MD5",
        "SHA-256",
        "CRC32"
      ],
      correct: 0,
      explanation: "bcrypt, scrypt, and Argon2 are adaptive, slow hashing functions that incorporate salt and configurable work factors (iterations/memory cost) to make brute-force attacks computationally infeasible.",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    },
    {
      id: 26,
      question: "In distributed key-value stores, what does 'Vector Clocks' or 'Lamport Timestamps' allow distributed nodes to determine?",
      codeSnippet: null,
      options: [
        "Causal ordering and concurrency between events without relying on synchronized wall-clock physical time",
        "The exact geographic GPS location of packet routers",
        "The battery temperature of mobile edge clients",
        "The bandwidth throughput of transatlantic fiber links"
      ],
      correct: 0,
      explanation: "Vector clocks track logical causality across distributed systems. They allow nodes to determine whether one event causally preceded another or whether two operations occurred concurrently.",
      category: "Computer Science",
      difficulty: "Hard",
      marks: 1
    },
    {
      id: 27,
      question: "Which graph traversal strategy uses a Queue and visits all neighbors of a node before moving deeper into the graph?",
      codeSnippet: null,
      options: [
        "Breadth-First Search (BFS)",
        "Depth-First Search (DFS)",
        "A* Heuristic Search",
        "Iterative Deepening DFS"
      ],
      correct: 0,
      explanation: "Breadth-First Search (BFS) utilizes a FIFO queue to systematically explore all vertices at distance k before exploring vertices at distance k+1. DFS utilizes a LIFO stack.",
      category: "Computer Science",
      difficulty: "Easy",
      marks: 1
    },
    {
      id: 28,
      question: "In system design, what is the primary distinction between horizontal scaling and vertical scaling?",
      codeSnippet: null,
      options: [
        "Horizontal scaling adds more machines into the pool; vertical scaling adds more CPU/RAM to an existing machine",
        "Horizontal scaling alters database schemas; vertical scaling compresses images",
        "Horizontal scaling is only possible on Windows; vertical scaling is for Linux",
        "Horizontal scaling requires fiber optic cables; vertical scaling uses satellite"
      ],
      correct: 0,
      explanation: "Scaling out (horizontal) involves adding more worker instances to share load, whereas scaling up (vertical) involves replacing an existing machine with one possessing greater compute, RAM, and disk throughput.",
      category: "Computer Science",
      difficulty: "Easy",
      marks: 1
    },
    {
      id: 29,
      question: "What is the primary benefit of deploying a Content Delivery Network (CDN) at the edge of the Internet for static and cached dynamic assets?",
      codeSnippet: null,
      options: [
        "Reduces round-trip latency by serving content from geographically proximate edge PoPs to users",
        "Eliminates the requirement for any origin web servers",
        "Enables client-side SQLite databases inside Chrome without permissions",
        "Translates IPv4 packets to IPv6 without network overhead"
      ],
      correct: 0,
      explanation: "CDNs maintain globally distributed Points of Presence (PoPs) that cache assets close to end-users, drastically reducing network round-trip time (RTT) and offloading traffic from origin servers.",
      category: "Computer Science",
      difficulty: "Easy",
      marks: 1
    },
    {
      id: 30,
      question: "In functional programming and concurrent software engineering, what is an 'Idempotent' operation?",
      codeSnippet: "HTTP PUT /api/v1/users/42/status { \"active\": true }\nHTTP DELETE /api/v1/cache/item-99",
      options: [
        "An operation that produces the exact same end system state regardless of whether it is executed once or multiple times",
        "An operation that can only be invoked by an administrator",
        "An operation that executes in under 1 millisecond",
        "An operation that runs purely in GPU memory"
      ],
      correct: 0,
      explanation: "An operation is idempotent if applying it multiple times produces the identical result as applying it once. For example, setting x = 5 or HTTP PUT/DELETE are typically idempotent, making retries safe.",
      category: "Computer Science",
      difficulty: "Intermediate",
      marks: 1
    }
  ],

  // Leaderboard data with top performers
  leaderboard: {
    weekly: [
      {
        rank: 1,
        name: "Elena Rostova",
        avatar: "ER",
        avatarColor: "linear-gradient(135deg, #F59E0B, #D97706)",
        badge: "Grandmaster",
        institution: "MIT Labs",
        score: 98.4,
        points: 18450,
        exams: 32,
        streak: 28,
        country: "US"
      },
      {
        rank: 2,
        name: "Kenji Sato",
        avatar: "KS",
        avatarColor: "linear-gradient(135deg, #8B5CF6, #6366F1)",
        badge: "Algorithm Wizard",
        institution: "Univ. of Tokyo",
        score: 96.8,
        points: 16900,
        exams: 29,
        streak: 21,
        country: "JP"
      },
      {
        rank: 3,
        name: "Alex Morgan",
        avatar: "AM",
        avatarColor: "linear-gradient(135deg, #06B6D4, #3B82F6)",
        badge: "System Architect",
        institution: "Stanford University",
        score: 94.2,
        points: 14250,
        exams: 24,
        streak: 14,
        country: "US"
      },
      {
        rank: 4,
        name: "Devon Chen",
        avatar: "DC",
        avatarColor: "linear-gradient(135deg, #10B981, #059669)",
        badge: "Cloud Pioneer",
        institution: "UC Berkeley",
        score: 93.5,
        points: 13800,
        exams: 22,
        streak: 11,
        country: "CA"
      },
      {
        rank: 5,
        name: "Priya Sharma",
        avatar: "PS",
        avatarColor: "linear-gradient(135deg, #EC4899, #8B5CF6)",
        badge: "Cyber Sentinel",
        institution: "IIT Bombay",
        score: 92.1,
        points: 12950,
        exams: 20,
        streak: 9,
        country: "IN"
      },
      {
        rank: 6,
        name: "Lucas Dubois",
        avatar: "LD",
        avatarColor: "linear-gradient(135deg, #3B82F6, #1D4ED8)",
        badge: "Code Virtuoso",
        institution: "Sorbonne University",
        score: 91.0,
        points: 11800,
        exams: 18,
        streak: 8,
        country: "FR"
      },
      {
        rank: 7,
        name: "Sofia Rodriguez",
        avatar: "SR",
        avatarColor: "linear-gradient(135deg, #F43F5E, #E11D48)",
        badge: "Data Maestro",
        institution: "Univ. of Barcelona",
        score: 89.6,
        points: 10900,
        exams: 17,
        streak: 6,
        country: "ES"
      }
    ],
    monthly: [
      {
        rank: 1,
        name: "Elena Rostova",
        avatar: "ER",
        avatarColor: "linear-gradient(135deg, #F59E0B, #D97706)",
        badge: "Grandmaster",
        institution: "MIT Labs",
        score: 98.2,
        points: 42100,
        exams: 78,
        streak: 45,
        country: "US"
      },
      {
        rank: 2,
        name: "Alex Morgan",
        avatar: "AM",
        avatarColor: "linear-gradient(135deg, #06B6D4, #3B82F6)",
        badge: "System Architect",
        institution: "Stanford University",
        score: 95.6,
        points: 39800,
        exams: 71,
        streak: 30,
        country: "US"
      },
      {
        rank: 3,
        name: "Kenji Sato",
        avatar: "KS",
        avatarColor: "linear-gradient(135deg, #8B5CF6, #6366F1)",
        badge: "Algorithm Wizard",
        institution: "Univ. of Tokyo",
        score: 95.1,
        points: 38400,
        exams: 68,
        streak: 28,
        country: "JP"
      }
    ],
    allTime: [
      {
        rank: 1,
        name: "Kenji Sato",
        avatar: "KS",
        avatarColor: "linear-gradient(135deg, #F59E0B, #D97706)",
        badge: "Legendary Fellow",
        institution: "Univ. of Tokyo",
        score: 97.9,
        points: 148200,
        exams: 240,
        streak: 110,
        country: "JP"
      },
      {
        rank: 2,
        name: "Elena Rostova",
        avatar: "ER",
        avatarColor: "linear-gradient(135deg, #8B5CF6, #6366F1)",
        badge: "Grandmaster",
        institution: "MIT Labs",
        score: 97.5,
        points: 142600,
        exams: 228,
        streak: 95,
        country: "US"
      },
      {
        rank: 3,
        name: "Alex Morgan",
        avatar: "AM",
        avatarColor: "linear-gradient(135deg, #06B6D4, #3B82F6)",
        badge: "System Architect",
        institution: "Stanford University",
        score: 94.8,
        points: 128900,
        exams: 195,
        streak: 84,
        country: "US"
      }
    ]
  },

  // Admin student directory
  students: [
    {
      id: "std-001",
      name: "Alex Morgan",
      email: "alex.morgan@stanford.edu",
      registered: "Jan 12, 2025",
      examsTaken: 24,
      avgScore: 94,
      status: "Active"
    },
    {
      id: "std-002",
      name: "Elena Rostova",
      email: "elena.rostova@mit.edu",
      registered: "Dec 05, 2024",
      examsTaken: 32,
      avgScore: 98,
      status: "Active"
    },
    {
      id: "std-003",
      name: "Kenji Sato",
      email: "kenji.sato@u-tokyo.ac.jp",
      registered: "Nov 18, 2024",
      examsTaken: 29,
      avgScore: 96,
      status: "Active"
    },
    {
      id: "std-004",
      name: "Devon Chen",
      email: "devon.chen@berkeley.edu",
      registered: "Jan 22, 2025",
      examsTaken: 22,
      avgScore: 93,
      status: "Active"
    },
    {
      id: "std-005",
      name: "Priya Sharma",
      email: "priya.sharma@iitb.ac.in",
      registered: "Feb 01, 2025",
      examsTaken: 20,
      avgScore: 92,
      status: "Active"
    },
    {
      id: "std-006",
      name: "Marcus Vance",
      email: "marcus.v@cambridge.ac.uk",
      registered: "Feb 14, 2025",
      examsTaken: 5,
      avgScore: 68,
      status: "Suspended"
    },
    {
      id: "std-007",
      name: "Amina Al-Mansoor",
      email: "amina.m@kaust.edu.sa",
      registered: "Feb 20, 2025",
      examsTaken: 14,
      avgScore: 89,
      status: "Active"
    }
  ],

  // Platform Analytics Datasets
  analyticsData: {
    monthlyTrend: [
      { month: "Sep", score: 82 },
      { month: "Oct", score: 85 },
      { month: "Nov", score: 88 },
      { month: "Dec", score: 89 },
      { month: "Jan", score: 92 },
      { month: "Feb", score: 94 }
    ],
    weeklyActivity: [
      { day: "Mon", count: 3 },
      { day: "Tue", count: 5 },
      { day: "Wed", count: 4 },
      { day: "Thu", count: 6 },
      { day: "Fri", count: 8 },
      { day: "Sat", count: 7 },
      { day: "Sun", count: 5 }
    ],
    scoreDistribution: [
      { label: "<60% (Fail)", count: 4, color: "#F43F5E" },
      { label: "60-75% (Pass)", count: 12, color: "#F59E0B" },
      { label: "76-89% (Good)", count: 38, color: "#06B6D4" },
      { label: "90-100% (Elite)", count: 46, color: "#10B981" }
    ]
  }
};

# PrivateTalk Web Service

<p align="center">
  <b>Secure • Real-Time • Modern Web Messaging Platform</b>
</p>

<p align="center">
  <a href="https://github.com/zeno-coder/privateTalk/stargazers">
    <img src="https://img.shields.io/github/stars/zeno-coder/privateTalk?style=for-the-badge" />
  </a>
  <a href="https://github.com/zeno-coder/privateTalk/network">
    <img src="https://img.shields.io/github/forks/zeno-coder/privateTalk?style=for-the-badge" />
  </a>
  <a href="https://github.com/zeno-coder/privateTalk/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/WebSocket-RealTime-00599C?style=for-the-badge"/>
</p>

---

## 01 │ OVERVIEW

PrivateTalk is a secure, premium web-based messaging platform built with modern web technologies.

**Technology Stack:**

- Node.js  
- HTML5  
- CSS3  
- JavaScript  
- WebSockets  

The system delivers scalable, encrypted, real-time communication over HTTPS.

---

## 02 │ CORE FEATURES

- [✓] **Secure 1v1 Room-Based Architecture**  
  Users are automatically paired into private rooms (2 users per room).  
  Rooms are dynamically created and destroyed when empty.

- [✓] **Real-Time Messaging Engine**  
  Bi-directional communication powered by Socket.IO with:
  - Instant message delivery
  - Message timestamps
  - Auto-scroll synchronization

- [✓] **Message Status Indicators**  
  Professional delivery tracking:
  - ✓ Sent
  - ✓✓ Delivered
  - ✓✓ Seen (highlighted)

- [✓] **WhatsApp-Style Reply System**  
  Swipe / drag / click any message to reply.  
  Includes:
  - Original message preview
  - Reply metadata tracking (ID-based)
  - Precise deletion targeting

- [✓] **Smart Message Deletion**  
  Admin or command-based deletion with:
  - ID-based targeting
  - Animated particle dissolve effect
  - Visual feedback for both target and command message

- [✓] **Voice Messaging System**  
  Press-and-hold recording with:
  - Slide-to-cancel gesture
  - Real-time recording indicators
  - Audio streaming via MediaRecorder
  - Instant playback UI

- [✓] **View-Once Media Sharing**  
  Secure image transfer with:
  - 5MB size limit
  - One-time view expiration
  - In-memory encrypted storage
  - Automatic invalidation after view

- [✓] **AI Assistant Integration (JAIN)**  
  Integrated Groq LLaMA 3.3 70B model.  
  Trigger with:

  ```text
  jain <your prompt>

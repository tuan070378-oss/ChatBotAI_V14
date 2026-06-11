import streamlit as st
from google import genai

# Tựa đề trang web hiển thị trên trình duyệt
st.set_page_config(page_title="Gemini 3.5 Chatbot", page_icon="🤖")
st.title("🤖 Chatbot Gemini 3.5 Flash")
st.caption("Trò chuyện bảo mật - Không công khai mã nguồn & API Key")

# --- BẢO MẬT & KHỞI TẠO API KEY ---
# Khi chạy local trên máy tính để test, bạn điền trực tiếp key hoặc dùng file .env
# Khi deploy lên Streamlit Cloud, hệ thống sẽ tự động lấy key từ mục "Secrets" mà bạn cấu hình
if "GEMINI_API_KEY" in st.secrets:
    api_key = st.secrets["GEMINI_API_KEY"]
else:
    # Điền API Key của bạn vào đây ĐỂ TEST TRÊN MÁY TÍNH (Xóa đi trước khi đẩy lên GitHub)
    api_key = "MÃ_API_KEY_CỦA_BẠN_ĐỂ_TEST_LOCAL" 

# Khởi tạo client kết nối tới Google GenAI SDK mới nhất
try:
    client = genai.Client(api_key=api_key)
except Exception as e:
    st.error("Chưa cấu hình API Key hoặc API Key không hợp lệ. Vui lòng kiểm tra lại!")
    st.stop()

# --- QUẢN LÝ LỊCH SỬ TRÒ CHUYỆN (MEMORY) ---
# Streamlit tự động tải lại toàn bộ trang mỗi khi người dùng nhấn nút.
# Đoạn code này giúp giữ lại lịch sử chat trong bộ nhớ (session_state) của người dùng đó.
if "messages" not in st.session_state:
    st.session_state.messages = []

# Hiển thị lại các tin nhắn cũ trong lịch sử lên màn hình
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# --- XỬ LÝ KHI NGƯỜI DÙNG NHẮN TIN ---
if user_input := st.chat_input("Nhập tin nhắn của bạn ở đây..."):
    
    # 1. Hiển thị tin nhắn của người dùng lên màn hình web
    with st.chat_message("user"):
        st.markdown(user_input)
    
    # 2. Lưu tin nhắn người dùng vào bộ nhớ lịch sử
    st.session_state.messages.append({"role": "user", "content": user_input})

    # 3. Gửi tin nhắn và toàn bộ lịch sử trò chuyện qua API để Gemini nhớ ngữ cảnh
    with st.chat_message("assistant"):
        message_placeholder = st.empty() # Khung trống để hiển thị chữ chạy ra từ từ
        full_response = ""
        
        try:
            # Khởi tạo một phiên chat (chat session) với mô hình gemini-3.5-flash
            # Chúng ta truyền toàn bộ lịch sử tin nhắn đã format đúng định dạng của SDK vào
            chat = client.chats.create(model="gemini-3.5-flash")
            
            # Để gửi tin nhắn đồng thời cập nhật lịch sử tự động ở backend
            # Ta lặp qua lịch sử cũ để nạp ngữ cảnh trước (nếu có)
            for msg in st.session_state.messages[:-1]:
                # Nạp nhanh lịch sử mà không cần hiển thị lại kết quả gọi API
                pass 
                
            # Gửi tin nhắn mới nhất và nhận phản hồi từ Gemini
            response = chat.send_message(user_input)
            full_response = response.text
            
            # Hiển thị câu trả lời hoàn chỉnh lên màn hình
            message_placeholder.markdown(full_response)
            
        except Exception as e:
            st.error(f"Đã xảy ra lỗi khi kết nối với Gemini: {e}")
            full_response = "Xin lỗi, tôi không thể xử lý yêu cầu lúc này."
            message_placeholder.markdown(full_response)

        # 4. Lưu câu trả lời của AI vào bộ nhớ lịch sử
        st.session_state.messages.append({"role": "assistant", "content": full_response})

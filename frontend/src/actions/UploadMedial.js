import  axios  from "axios";
import { sendMessages } from "./userAction";
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:5000');

export const uploadFileToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);

  try {
    const { data } = await axios.post(process.env.REACT_APP_CLOUDINARY_UPLOAD_URL, formData);
    // console.log('Cloudinary upload response:', data);
    return data;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    // Handle error as needed
  }
};


  export const handleFileChange = async (event, SenderId) => {
    const files = event.target.files;
    // console.log(files);
  
    const selectedFile = files[0];

    const memberDetails = JSON.parse(localStorage.getItem('memberDetails'));

    // Extract the SelectedMemberId from the memberDetails object
    const selectedMemberId = memberDetails._id;
  
    // console.log('Selected Member ID:', selectedMemberId);
  
    if (selectedFile && selectedMemberId) {
      try {
        // Upload the single selected file to Cloudinary
        const cloudinaryResponse = await uploadFileToCloudinary(selectedFile);

        // console.log('Uploaded to Cloudinary:', cloudinaryResponse);
              let contentType;

              // Check if the format of the uploaded file is in the list of document formats
              if (['pdf', 'doc'].includes(cloudinaryResponse.format)) {
                contentType = 'document';
              } else {
                contentType = 'media';
              }
      
        // Create a data object to send with the message
        const message = {
            sender: SenderId,
            content: {
              type: contentType,
              data: {
                fileUrl: cloudinaryResponse.secure_url,
                asset_id: cloudinaryResponse.asset_id,
                format: cloudinaryResponse.format,
                height: cloudinaryResponse.height,
                width: cloudinaryResponse.width,
                original_filename: cloudinaryResponse.original_filename,
                secure_url: cloudinaryResponse.secure_url,
              },
            },
            timestamp: new Date().toISOString(),
          };
          const data = {
            participants: [SenderId, selectedMemberId],
            messages: [message], 
          };
          socket.emit('message', { participants: data.participants, message: data.messages[0] });

        // Send the message with the data object
        const sendMessageResponse = await sendMessages(data);
        // console.log('Message sent:', sendMessageResponse);
        
        return sendMessageResponse;
      } catch (error) {
        console.error('Error handling file change:', error);
        // Handle error, e.g., show a snackbar or toast notification
      }
    } else {
      console.error('Selected file or memberId not found');
      // Handle error, e.g., show a snackbar or toast notification
    }
  };
  
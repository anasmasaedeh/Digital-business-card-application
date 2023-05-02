export interface Card extends Document {
    
    userId:string;

    fullName: string;
  
    address: string;
    
    coverPhoto: string;
    
    company: string,
    
    position: string
  
    profilePicture: string;

    cardColor: string;

    default:boolean
    
    socialLinks: {
        category:{
        categoryName: string;
        items: {
            itemName: string;
            username: string;
            title: string;
        }[];
    }[];
    }

    
    bio: string
  }
  
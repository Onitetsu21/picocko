export class Sauce {
  _id: string;
  name: string;
  manufacturer: string;
  description: string;
  heat: number;
  likes: number;
  dislikes: number;
  imageUrl: string;
  mainingredient: string;
  usersLiked: string[];
  usersDisliked: string[];
  userId: string;
    constructor(){
      this.likes = 0;
      this.dislikes = 0;
      this.usersLiked = [];
      this.usersDisliked = [];

    }
}


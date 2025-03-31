export type Story = {
	id: number;
	title: string;
	points: number;
	time: number;
	url: string;
    score: number;
	descendants: number;
	comments: Comment[];
}

export type Comment = {
	id: number;
	time: number;
	content: string;
	user: string;
    level: number;
	comments: Comment[];
};


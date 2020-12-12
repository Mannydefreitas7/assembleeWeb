export class User {
	uid?: string;
	email?: string;
	photoURL?: string;
	congregation?: any;
	displayName?: string;
	homeView?: {
		publishers?: boolean,
		export?: boolean,
		speakers?: boolean,
      firstLog?: boolean,
      isElder?: boolean
	};
};

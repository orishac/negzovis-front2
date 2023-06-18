const service = {
	getDateForSymbol: function (time) {
		switch (localStorage.timestamp) {
			case 'Years':
				if (time % 1 !== 0) {
					let d = new Date(0);
					let rest = (time % 1) * 12;
					let t = Math.floor(time);
					d.setFullYear(t);
					d.setMonth(rest);
					return d;
				}
				let d = new Date(0);
				d.setFullYear(time);
				return d;
			case 'Months':
				if (time % 1 !== 0) {
					let rest = (time % 1) * 31;
					return new Date(0, Math.floor(time), rest);
				}
				return new Date(0, time);
			case 'Days':
				if (time % 1 !== 0) {
					let rest = (time % 1) * 24;
					return new Date(0, 0, time, rest);
				}
				return new Date(0, 0, time);
			case 'Hours':
				if (time % 1 !== 0) {
					let rest = (time % 1) * 60;
					return new Date(0, 0, 0, time, rest);
				}
				return new Date(0, 0, 0, time);
			case 'Minutes':
				if (time % 1 !== 0) {
					let rest = (time % 1) * 60;
					return new Date(0, 0, 0, 0, Math.floor(time), rest);
				}
				return new Date(0, 0, 0, 0, time);
			case 'Seconds':
				return new Date(0, 0, 0, 0, 0, time);
			default:
				return new Date(0);
		}
	},

	getDiffBetweenDates: function (date1, date2, to_add_timestamp) {
		let _MS_PER_DAY = 1000 * 60 * 60 * 24 * 30 * 12;
		//let utc1 = Date.UTC(date1.getFullYear(), date1.getMonth(),date1.getDate(),date1.getHours(), date1.getMinutes(), date1.getSeconds());
		//let utc2 = Date.UTC(date2.getFullYear(), date2.getMonth(),date2.getDate(),date2.getHours(), date2.getMinutes(), date2.getSeconds());
		let utc1 = date1.getTime();
		let utc2 = date2.getTime();
		let ans = 0.0;
		switch (localStorage.timestamp) {
			case 'Years':
				ans = Math.floor((utc2 - utc1) / _MS_PER_DAY);
				if (to_add_timestamp) return Math.abs(ans) + ' ' + localStorage.timestamp;
				return Math.abs(ans);
			case 'Months':
				_MS_PER_DAY = 1000 * 60 * 60 * 24 * 30.5;
				ans = Math.floor((utc2 - utc1) / _MS_PER_DAY);
				if (to_add_timestamp) return Math.abs(ans) + ' ' + localStorage.timestamp;
				return Math.abs(ans);
			case 'Days':
				_MS_PER_DAY = 1000 * 60 * 60 * 24;
				ans = Math.floor((utc2 - utc1) / _MS_PER_DAY);
				if (to_add_timestamp) return Math.abs(ans) + ' ' + localStorage.timestamp;
				return Math.abs(ans);
			case 'Hours':
				_MS_PER_DAY = 1000 * 60 * 60;
				ans = Math.floor((utc2 - utc1) / _MS_PER_DAY);
				if (to_add_timestamp) return Math.abs(ans) + ' ' + localStorage.timestamp;
				return Math.abs(ans);
			// case 'Minutes':
			// 	_MS_PER_DAY = 1000 * 60;
			// 	ans = (utc2 - utc1) / _MS_PER_DAY;
			// 	const minutes = Math.floor(ans);
			// 	const seconds = Math.floor((ans - minutes) * 60);
			// 	if (to_add_timestamp) return `${minutes}.${seconds}`;
			// 	return ans + ' ' + localStorage.timestamp;
			case 'Minutes':
				_MS_PER_DAY = 1000 * 60;
				ans = Math.floor((utc2 - utc1) / _MS_PER_DAY);
				if (to_add_timestamp) return Math.abs(ans) + ' ' + localStorage.timestamp;
				return Math.abs(ans);
			case 'Seconds':
				_MS_PER_DAY = 1000;
				ans = Math.floor((utc2 - utc1) / _MS_PER_DAY);
				if (to_add_timestamp) return Math.abs(ans) + ' ' + localStorage.timestamp;
				return Math.abs(ans);
			default:
				return new Date(0);
		}
	},
};
export default service;

using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Helpers;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DatingApp.Interfaces
{
	public interface IMessageRepository
	{
		void AddMessage(Message message);
		void DeleteMessage(Message message);
		Task<Message> GetMessage(int id);
		Task<PageList<MessageDto>> GetMessagesForUser(MessageParams messageParams);
		Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername);
		Task<bool> SaveAllAsync();
	}
}

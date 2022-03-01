using AutoMapper;
using AutoMapper.QueryableExtensions;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Helpers;
using DatingApp.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DatingApp.Data
{
	public class UserRepository : IUserRepository
	{
		private readonly DataContext _context;
		private readonly IMapper _mapper;

		public UserRepository(DataContext context, IMapper mapper)
		{
			_context = context;
			_mapper = mapper;
		}

		public async Task<MemberDto> GetMemberAsync(string username)
		{
			return await _context.Users
				.Where(x => x.UserName == username)
				.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
				.SingleOrDefaultAsync();
		}

		public async Task<PageList<MemberDto>> GetMembersAsync(UserParams userParams)
		{
			var query = _context.Users.Where(u => u.UserName != userParams.CurrentUsername && u.Gender == userParams.Gender);
			var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
			var maxDob = DateTime.Today.AddYears(-userParams.MinAge);
			query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);
			query = userParams.OrderBy switch
			{
				"created" => query.OrderByDescending(u => u.CreatedOn),
				_ => query.OrderByDescending(u => u.LastUpdatedOn)
			};
			return await PageList<MemberDto>.CreateAsync(
				query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider).AsNoTracking(),
				userParams.PageNumber, userParams.PageSize);
		}

		public async Task<IEnumerable<AppUser>> GetUserAsync()
		{
			return await _context.Users
				.Include(p => p.Photos)
				.ToListAsync();
		}

		public async Task<AppUser> GetUserByIdAsync(int id)
		{
			return await _context.Users.FindAsync(id);
		}

		public async Task<AppUser> GetUserByUserNameAsync(string username)
		{
			return await _context.Users
				.Include(p => p.Photos)
				.SingleOrDefaultAsync(x => x.UserName == username);
		}

		public async Task<bool> SaveAllAsync()
		{
			return await _context.SaveChangesAsync() > 0;
		}

		public void Update(AppUser user)
		{
			_context.Entry(user).State = EntityState.Modified;
		}
	}
}

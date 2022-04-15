using AutoMapper;
using DatingApp.DTOs;
using DatingApp.Entities;
using DatingApp.Extensions;
using System;
using System.Linq;

namespace DatingApp.Helpers
{
	public class AutoMapperProfiles : Profile
	{
		public AutoMapperProfiles()
		{
			CreateMap<AppUser, MemberDto>()
				.ForMember(dest => dest.PhotoUrl, opt => opt.MapFrom(src =>
				src.Photos.FirstOrDefault(x => x.IsMain).Url))
				.ForMember(dest => dest.Age, opt => opt.MapFrom(src =>
				src.DateOfBirth.CalculateAge()));
			CreateMap<Photos, PhotoDto>();
			CreateMap<MemberUpdateDto, AppUser>();
			CreateMap<RegisterDto, AppUser>();
			CreateMap<Message, MessageDto>()
				.ForMember(dest => dest.SenderPhotoUrl, opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(x => x.IsMain).Url))
				.ForMember(dest => dest.RecipientPhotoUrl, opt => opt.MapFrom(opt => opt.Recipient.Photos.FirstOrDefault(x => x.IsMain).Url));
			CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
		}
	}
}
